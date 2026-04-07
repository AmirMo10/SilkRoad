import { pgTable, uuid, text, integer, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { orders, shippingTier } from "./orders";

export const shipmentStatus = pgEnum("shipment_status", [
  "processing_in_china",
  "shipped_from_china",
  "in_transit",
  "customs_clearance",
  "arrived_in_iran",
  "last_mile_delivery",
  "delivered",
]);

export type ShipmentHistoryEntry = {
  status: string;
  at: string;
  note?: string;
};

export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .unique()
    .references(() => orders.id),
  tier: shippingTier("tier").notNull(),
  currentStatus: shipmentStatus("current_status").notNull().default("processing_in_china"),
  statusHistory: jsonb("status_history").$type<ShipmentHistoryEntry[]>().notNull().default([]),
  etaMinDays: integer("eta_min_days").notNull(),
  etaMaxDays: integer("eta_max_days").notNull(),
  carrier: text("carrier"),
  trackingUrl: text("tracking_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
