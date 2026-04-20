import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  OrderError,
} from "@/server/services/order.service";

export const ordersRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).default(1),
          limit: z.number().int().min(1).max(50).default(20),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return getUserOrders(
        ctx.user.sub,
        input?.page ?? 1,
        input?.limit ?? 20,
      );
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const order = await getOrderById(input.id, ctx.user.sub);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      return order;
    }),

  create: protectedProcedure
    .input(
      z.object({
        items: z
          .array(
            z.object({
              productId: z.string().uuid(),
              quantity: z.number().int().min(1),
            }),
          )
          .min(1),
        shippingTier: z.enum(["turbo", "normal", "economy"]),
        splitRatio: z.number().min(0.4).max(0.5).optional(),
        shippingCostRial: z.bigint().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await createOrder({
          userId: ctx.user.sub,
          items: input.items,
          shippingTier: input.shippingTier,
          splitRatio: input.splitRatio,
          shippingCostRial: input.shippingCostRial,
        });
      } catch (err) {
        if (err instanceof OrderError) {
          const codeMap: Record<string, "BAD_REQUEST" | "NOT_FOUND"> = {
            MOQ_NOT_MET: "BAD_REQUEST",
            INVALID_SPLIT: "BAD_REQUEST",
            EMPTY_ORDER: "BAD_REQUEST",
            PRODUCT_NOT_FOUND: "NOT_FOUND",
          };
          throw new TRPCError({
            code: codeMap[err.code] ?? "INTERNAL_SERVER_ERROR",
            message: err.message,
          });
        }
        throw err;
      }
    }),
});
