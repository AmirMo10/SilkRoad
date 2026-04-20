import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { sql, eq, desc, count } from "drizzle-orm";
import { adminProcedure, router } from "../trpc";
import { products } from "@/server/db/schema/products";
import { orders } from "@/server/db/schema/orders";
import { users } from "@/server/db/schema/users";
import { categories } from "@/server/db/schema/categories";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  ProductError,
} from "@/server/services/product.service";
import {
  updateOrderStatus,
  OrderError,
} from "@/server/services/order.service";

export const adminRouter = router({
  stats: adminProcedure.query(async ({ ctx }) => {
    const [productCount] = await ctx.db.select({ value: count() }).from(products);
    const [orderCount] = await ctx.db.select({ value: count() }).from(orders);
    const [userCount] = await ctx.db.select({ value: count() }).from(users);

    const [revenue] = await ctx.db
      .select({ value: sql<string>`coalesce(sum(${orders.totalRial}), 0)` })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`);

    return {
      products: productCount?.value ?? 0,
      orders: orderCount?.value ?? 0,
      users: userCount?.value ?? 0,
      revenueToman: Math.round(Number(revenue?.value ?? 0) / 10),
    };
  }),

  recentOrders: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          id: orders.id,
          status: orders.status,
          totalRial: orders.totalRial,
          shippingTier: orders.shippingTier,
          createdAt: orders.createdAt,
          userId: orders.userId,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit);

      return rows.map((r) => ({
        ...r,
        totalToman: Math.round(Number(r.totalRial) / 10),
      }));
    }),

  productsList: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          id: products.id,
          slug: products.slug,
          nameFa: products.nameFa,
          nameEn: products.nameEn,
          wholesalePriceRial: products.wholesalePriceRial,
          moq: products.moq,
          quantityStep: products.quantityStep,
          weightKg: products.weightKg,
          isActive: products.isActive,
          categoryId: products.categoryId,
          createdAt: products.createdAt,
        })
        .from(products)
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const [total] = await ctx.db.select({ value: count() }).from(products);

      return {
        items: rows.map((r) => ({
          ...r,
          priceToman: Math.round(Number(r.wholesalePriceRial) / 10),
        })),
        total: total?.value ?? 0,
      };
    }),

  toggleProduct: adminProcedure
    .input(z.object({ id: z.string().uuid(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({ isActive: input.isActive, updatedAt: new Date() })
        .where(eq(products.id, input.id));
      return { ok: true };
    }),

  ordersList: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        status: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .select({
          id: orders.id,
          userId: orders.userId,
          status: orders.status,
          shippingTier: orders.shippingTier,
          totalRial: orders.totalRial,
          phase1AmountRial: orders.phase1AmountRial,
          phase2AmountRial: orders.phase2AmountRial,
          phase1PaidAt: orders.phase1PaidAt,
          phase2PaidAt: orders.phase2PaidAt,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.status) {
        query = query.where(sql`${orders.status} = ${input.status}`) as typeof query;
      }

      const rows = await query;
      const [total] = await ctx.db.select({ value: count() }).from(orders);

      return {
        items: rows.map((r) => ({
          ...r,
          totalToman: Math.round(Number(r.totalRial) / 10),
          phase1Toman: Math.round(Number(r.phase1AmountRial) / 10),
          phase2Toman: Math.round(Number(r.phase2AmountRial) / 10),
        })),
        total: total?.value ?? 0,
      };
    }),

  createProduct: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
        nameFa: z.string().min(1).max(200),
        nameEn: z.string().min(1).max(200),
        descriptionFa: z.string().min(1),
        descriptionEn: z.string().min(1),
        categoryId: z.string().uuid(),
        wholesalePriceRial: z.bigint().positive(),
        moq: z.number().int().min(1),
        quantityStep: z.number().int().min(1).default(1),
        weightKg: z.string().regex(/^\d+(\.\d{1,3})?$/),
        volumeCbm: z.string().regex(/^\d+(\.\d{1,4})?$/),
        images: z.array(z.string().url()).default([]),
        splitPaymentRatio: z.string().regex(/^0\.(4[0-9]|50)$/).optional(),
      }),
    )
    .mutation(async ({ input }) => createProduct(input)),

  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
        nameFa: z.string().min(1).max(200).optional(),
        nameEn: z.string().min(1).max(200).optional(),
        descriptionFa: z.string().min(1).optional(),
        descriptionEn: z.string().min(1).optional(),
        categoryId: z.string().uuid().optional(),
        wholesalePriceRial: z.bigint().positive().optional(),
        moq: z.number().int().min(1).optional(),
        quantityStep: z.number().int().min(1).optional(),
        weightKg: z.string().regex(/^\d+(\.\d{1,3})?$/).optional(),
        volumeCbm: z.string().regex(/^\d+(\.\d{1,4})?$/).optional(),
        images: z.array(z.string().url()).optional(),
        splitPaymentRatio: z.string().regex(/^0\.(4[0-9]|50)$/).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      try {
        return await updateProduct(id, rest);
      } catch (err) {
        if (err instanceof ProductError && err.code === "NOT_FOUND") {
          throw new TRPCError({ code: "NOT_FOUND", message: err.message });
        }
        throw err;
      }
    }),

  deleteProduct: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        return await deleteProduct(input.id);
      } catch (err) {
        if (err instanceof ProductError && err.code === "NOT_FOUND") {
          throw new TRPCError({ code: "NOT_FOUND", message: err.message });
        }
        throw err;
      }
    }),

  updateOrderStatus: adminProcedure
    .input(z.object({ orderId: z.string().uuid(), status: z.string() }))
    .mutation(async ({ input }) => {
      try {
        return await updateOrderStatus(input.orderId, input.status);
      } catch (err) {
        if (err instanceof OrderError) {
          throw new TRPCError({ code: "BAD_REQUEST", message: err.message });
        }
        throw err;
      }
    }),
});
