import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  shipments,
  type Shipment,
  type ShipmentHistoryEntry,
} from "@/server/db/schema/shipments";
import { orders } from "@/server/db/schema/orders";
import {
  type ShippingTier,
  type ShippingQuote,
  quoteShipping,
  getRate,
} from "@/lib/shipping-calculator";

export class ShippingError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

/* ── Shipment status transition map ────────────────────────────── */

type ShipmentStatus =
  | "processing_in_china"
  | "shipped_from_china"
  | "in_transit"
  | "customs_clearance"
  | "arrived_in_iran"
  | "last_mile_delivery"
  | "delivered";

const VALID_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  processing_in_china: ["shipped_from_china"],
  shipped_from_china: ["in_transit"],
  in_transit: ["customs_clearance"],
  customs_clearance: ["arrived_in_iran"],
  arrived_in_iran: ["last_mile_delivery"],
  last_mile_delivery: ["delivered"],
  delivered: [],
};

/** Maps shipment statuses to the corresponding order status update (if any). */
const SHIPMENT_TO_ORDER_STATUS: Partial<
  Record<ShipmentStatus, typeof orders.$inferSelect.status>
> = {
  shipped_from_china: "shipped_from_china",
  in_transit: "in_transit",
  customs_clearance: "customs_clearance",
  arrived_in_iran: "arrived_in_iran",
  last_mile_delivery: "delivering",
  delivered: "completed",
};

/* ── Cost & ETA ────────────────────────────────────────────────── */

export function calculateShippingCost(
  totalWeightKg: number,
  volumeCbm: number,
  tier: ShippingTier,
): bigint {
  const rate = getRate(tier);
  const quote: ShippingQuote = quoteShipping(
    [{ weightKg: totalWeightKg, volumeCbm, quantity: 1 }],
    rate,
  );
  return quote.costRial;
}

export interface EtaEstimate {
  tier: ShippingTier;
  minDays: number;
  maxDays: number;
}

export function getShippingEstimate(tier: ShippingTier): EtaEstimate {
  const rate = getRate(tier);
  return {
    tier,
    minDays: rate.etaMinDays,
    maxDays: rate.etaMaxDays,
  };
}

/* ── Status Transitions ────────────────────────────────────────── */

export async function updateShipmentStatus(
  shipmentId: string,
  newStatus: ShipmentStatus,
  note?: string,
): Promise<Shipment> {
  const [shipment] = await db
    .select()
    .from(shipments)
    .where(eq(shipments.id, shipmentId))
    .limit(1);

  if (!shipment) {
    throw new ShippingError("SHIPMENT_NOT_FOUND", "Shipment not found");
  }

  const currentStatus = shipment.currentStatus as ShipmentStatus;
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new ShippingError(
      "INVALID_TRANSITION",
      `Cannot transition from "${currentStatus}" to "${newStatus}". ` +
        `Allowed: ${allowed.length > 0 ? allowed.join(", ") : "none (terminal state)"}`,
    );
  }

  const now = new Date();

  const historyEntry: ShipmentHistoryEntry = {
    status: newStatus,
    at: now.toISOString(),
    ...(note ? { note } : {}),
  };

  const updatedHistory: ShipmentHistoryEntry[] = [
    ...(shipment.statusHistory as ShipmentHistoryEntry[]),
    historyEntry,
  ];

  const [updated] = await db
    .update(shipments)
    .set({
      currentStatus: newStatus,
      statusHistory: updatedHistory,
      updatedAt: now,
    })
    .where(eq(shipments.id, shipmentId))
    .returning();

  // Sync corresponding order status if applicable
  const orderStatus = SHIPMENT_TO_ORDER_STATUS[newStatus];
  if (orderStatus) {
    // Special case: when shipment arrives in Iran, order goes to awaiting_phase2
    const mappedOrderStatus =
      newStatus === "arrived_in_iran" ? "awaiting_phase2" : orderStatus;

    await db
      .update(orders)
      .set({
        status: mappedOrderStatus,
        ...(newStatus === "delivered" ? { actualDeliveryAt: now } : {}),
        updatedAt: now,
      })
      .where(eq(orders.id, shipment.orderId));
  }

  return updated;
}

/* ── Query ──────────────────────────────────────────────────────── */

export async function getShipmentByOrder(orderId: string): Promise<Shipment | null> {
  const [shipment] = await db
    .select()
    .from(shipments)
    .where(eq(shipments.orderId, orderId))
    .limit(1);

  return shipment ?? null;
}
