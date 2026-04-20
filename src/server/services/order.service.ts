import { eq, and, desc } from "drizzle-orm";
import { db } from "@/server/db";
import {
  orders,
  orderItems,
  type Order,
  type NewOrder,
  type NewOrderItem,
} from "@/server/db/schema/orders";
import { products } from "@/server/db/schema/products";
import {
  DEFAULT_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
  MAX_SPLIT_RATIO,
} from "@/lib/constants";

export class OrderError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

interface OrderLineInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  userId: string;
  items: OrderLineInput[];
  shippingTier: "turbo" | "normal" | "economy";
  splitRatio?: number;
  shippingCostRial: bigint;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { userId, items, shippingTier, shippingCostRial } = input;
  const splitRatio = input.splitRatio ?? DEFAULT_SPLIT_RATIO;

  if (splitRatio < MIN_SPLIT_RATIO || splitRatio > MAX_SPLIT_RATIO) {
    throw new OrderError("INVALID_SPLIT", "Split ratio out of allowed range");
  }
  if (items.length === 0) {
    throw new OrderError("EMPTY_ORDER", "Order must have at least one item");
  }

  const productIds = items.map((i) => i.productId);
  const productRows = await db
    .select({
      id: products.id,
      moq: products.moq,
      wholesalePriceRial: products.wholesalePriceRial,
      isActive: products.isActive,
    })
    .from(products)
    .where(eq(products.isActive, true));

  const productMap = new Map(productRows.map((p) => [p.id, p]));

  let subtotalRial = 0n;
  const orderItemValues: Omit<NewOrderItem, "id" | "orderId">[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new OrderError("PRODUCT_NOT_FOUND", `Product ${item.productId} not found or inactive`);
    }
    if (item.quantity < product.moq) {
      throw new OrderError("MOQ_NOT_MET", `Quantity ${item.quantity} is below MOQ ${product.moq}`);
    }

    const lineTotal = product.wholesalePriceRial * BigInt(item.quantity);
    subtotalRial += lineTotal;

    orderItemValues.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPriceRial: product.wholesalePriceRial,
      lineTotalRial: lineTotal,
    });
  }

  const totalRial = subtotalRial + shippingCostRial;
  const phase1Rial = BigInt(Math.round(Number(totalRial) * splitRatio));
  const phase2Rial = totalRial - phase1Rial;

  const [order] = await db
    .insert(orders)
    .values({
      userId,
      shippingTier,
      subtotalRial,
      shippingCostRial,
      totalRial,
      splitRatio: splitRatio.toFixed(2),
      phase1AmountRial: phase1Rial,
      phase2AmountRial: phase2Rial,
    })
    .returning();

  await db.insert(orderItems).values(
    orderItemValues.map((oi) => ({
      ...oi,
      orderId: order.id,
    })),
  );

  return order;
}

export async function getOrderById(orderId: string, userId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}

export async function getUserOrders(
  userId: string,
  page = 1,
  limit = 20,
) {
  const offset = (page - 1) * limit;
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  return rows;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  awaiting_phase1: ["phase1_paid", "cancelled"],
  phase1_paid: ["processing"],
  processing: ["shipped_from_china", "cancelled"],
  shipped_from_china: ["in_transit"],
  in_transit: ["customs_clearance"],
  customs_clearance: ["arrived_in_iran"],
  arrived_in_iran: ["awaiting_phase2"],
  awaiting_phase2: ["phase2_paid", "phase2_overdue"],
  phase2_overdue: ["phase2_paid", "cancelled"],
  phase2_paid: ["delivering"],
  delivering: ["completed"],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
): Promise<Order> {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) throw new OrderError("NOT_FOUND", "Order not found");

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed?.includes(newStatus)) {
    throw new OrderError(
      "INVALID_TRANSITION",
      `Cannot transition from ${order.status} to ${newStatus}`,
    );
  }

  const updates: Partial<Record<string, unknown>> = {
    status: newStatus,
    updatedAt: new Date(),
  };

  if (newStatus === "phase1_paid") updates.phase1PaidAt = new Date();
  if (newStatus === "phase2_paid") updates.phase2PaidAt = new Date();
  if (newStatus === "completed") updates.actualDeliveryAt = new Date();

  const [updated] = await db
    .update(orders)
    .set(updates)
    .where(eq(orders.id, orderId))
    .returning();

  return updated;
}
