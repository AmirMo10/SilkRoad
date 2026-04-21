import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { orders } from "@/server/db/schema/orders";
import {
  getPaymentsByOrder,
  initiatePhase1Payment,
  initiatePhase2Payment,
} from "@/server/services/payment.service";

const gatewayInput = z.enum(["zarinpal", "idpay", "payir"]);

export const paymentsRouter = router({
  /** List all payments for an order (buyer must own the order). */
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

      const paymentRows = await getPaymentsByOrder(input.orderId);

      return paymentRows.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        phase: p.phase,
        amountToman: Math.round(Number(p.amountRial) / 10),
        gateway: p.gateway,
        status: p.status,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      }));
    }),

  /** Initiate phase 1 (upfront) payment — returns gateway redirect URL. */
  initiatePhase1: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        gateway: gatewayInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
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

      try {
        const result = await initiatePhase1Payment(input.orderId, input.gateway);
        return result;
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

  /** Initiate phase 2 (remaining) payment — returns gateway redirect URL. */
  initiatePhase2: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        gateway: gatewayInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
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

      try {
        const result = await initiatePhase2Payment(input.orderId, input.gateway);
        return result;
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
