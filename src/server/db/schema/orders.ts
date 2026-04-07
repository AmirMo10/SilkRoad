import {
  pgTable,
  uuid,
  text,
  bigint,
  integer,
  numeric,
  timestamp,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { products } from "./products";

export const orderStatus = pgEnum("order_status", [
  "awaiting_phase1",
  "phase1_paid",
  "processing",
  "shipped_from_china",
  "in_transit",
  "customs_clearance",
  "arrived_in_iran",
  "awaiting_phase2",
  "phase2_overdue",
  "phase2_paid",
  "delivering",
  "completed",
  "cancelled",
]);

export const shippingTier = pgEnum("shipping_tier", ["turbo", "normal", "economy"]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: orderStatus("status").notNull().default("awaiting_phase1"),
    shippingTier: shippingTier("shipping_tier").notNull(),
    subtotalRial: bigint("subtotal_rial", { mode: "bigint" }).notNull(),
    shippingCostRial: bigint("shipping_cost_rial", { mode: "bigint" }).notNull(),
    totalRial: bigint("total_rial", { mode: "bigint" }).notNull(),
    splitRatio: numeric("split_ratio", { precision: 3, scale: 2 }).notNull(),
    phase1AmountRial: bigint("phase1_amount_rial", { mode: "bigint" }).notNull(),
    phase2AmountRial: bigint("phase2_amount_rial", { mode: "bigint" }).notNull(),
    phase1PaidAt: timestamp("phase1_paid_at", { withTimezone: true }),
    phase2PaidAt: timestamp("phase2_paid_at", { withTimezone: true }),
    phase2DueAt: timestamp("phase2_due_at", { withTimezone: true }),
    estimatedDeliveryAt: timestamp("estimated_delivery_at", { withTimezone: true }),
    actualDeliveryAt: timestamp("actual_delivery_at", { withTimezone: true }),
    trackingNumber: text("tracking_number"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    phaseSumCheck: check(
      "phase_sum_eq_total",
      sql`${table.phase1AmountRial} + ${table.phase2AmountRial} = ${table.totalRial}`,
    ),
  }),
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPriceRial: bigint("unit_price_rial", { mode: "bigint" }).notNull(),
  lineTotalRial: bigint("line_total_rial", { mode: "bigint" }).notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
