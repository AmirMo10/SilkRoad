import { pgTable, uuid, text, bigint, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const paymentPhase = pgEnum("payment_phase", ["phase_1", "phase_2"]);
export const paymentGateway = pgEnum("payment_gateway", ["zarinpal", "idpay", "payir"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "success", "failed", "refunded"]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id),
    phase: paymentPhase("phase").notNull(),
    amountRial: bigint("amount_rial", { mode: "bigint" }).notNull(),
    gateway: paymentGateway("gateway").notNull(),
    gatewayRef: text("gateway_ref").notNull(),
    status: paymentStatus("status").notNull().default("pending"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    gatewayRefUnique: unique("payments_gateway_ref_unique").on(table.gateway, table.gatewayRef),
  }),
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
