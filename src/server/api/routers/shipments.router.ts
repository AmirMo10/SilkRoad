import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { orders } from "@/server/db/schema/orders";
import {
  getShipmentByOrder,
  updateShipmentStatus,
} from "@/server/services/shipping.service";

const shipmentStatusInput = z.enum([
  "processing_in_china",
  "shipped_from_china",
  "in_transit",
  "customs_clearance",
  "arrived_in_iran",
  "last_mile_delivery",
  "delivered",
]);

export const shipmentsRouter = router({
  /** Get shipment details for an order (buyer must own the order). */
  byOrder: protectedProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify the caller owns this order
      const [order] = await ctx.db
        .select({ id: orders.id, userId: orders.userId })
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      if (order.userId !== ctx.user.sub) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your order" });
      }

      const shipment = await getShipmentByOrder(input.orderId);

      if (!shipment) {
        return null;
      }

      return {
        id: shipment.id,
        orderId: shipment.orderId,
        tier: shipment.tier,
        currentStatus: shipment.currentStatus,
        statusHistory: shipment.statusHistory,
        etaMinDays: shipment.etaMinDays,
        etaMaxDays: shipment.etaMaxDays,
        carrier: shipment.carrier,
        trackingUrl: shipment.trackingUrl,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      };
    }),

  /** Update shipment status (admin only). Validates transition rules. */
  updateStatus: adminProcedure
    .input(
      z.object({
        shipmentId: z.string().uuid(),
        status: shipmentStatusInput,
        note: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const updated = await updateShipmentStatus(
          input.shipmentId,
          input.status,
          input.note,
        );

        return {
          id: updated.id,
          orderId: updated.orderId,
          currentStatus: updated.currentStatus,
          updatedAt: updated.updatedAt,
        };
      } catch (err) {
        if (err instanceof Error && "code" in err) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: err.message,
          });
        }
        throw err;
      }
    }),
});
