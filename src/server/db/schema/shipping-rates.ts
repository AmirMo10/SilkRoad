import { pgTable, uuid, integer, bigint, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { shippingTier } from "./orders";

export const shippingRates = pgTable("shipping_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  tier: shippingTier("tier").notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  weightMinKg: numeric("weight_min_kg", { precision: 10, scale: 3 }).notNull(),
  weightMaxKg: numeric("weight_max_kg", { precision: 10, scale: 3 }).notNull(),
  ratePerKgRial: bigint("rate_per_kg_rial", { mode: "bigint" }).notNull(),
  baseCostRial: bigint("base_cost_rial", { mode: "bigint" }).notNull(),
  etaMinDays: integer("eta_min_days").notNull(),
  etaMaxDays: integer("eta_max_days").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ShippingRate = typeof shippingRates.$inferSelect;
export type NewShippingRate = typeof shippingRates.$inferInsert;
