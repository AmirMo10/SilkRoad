import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { payments, type Payment, type NewPayment } from "@/server/db/schema/payments";
import { orders, type Order } from "@/server/db/schema/orders";
import { calculateSplit } from "@/lib/payment-calculator";

export class PaymentError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

type PaymentGateway = "zarinpal" | "idpay" | "payir";

interface PaymentInitResult {
  paymentId: string;
  gatewayUrl: string;
}

/* ── Helpers ────────────────────────────────────────────────────── */

async function fetchOrderOrThrow(orderId: string): Promise<Order> {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    throw new PaymentError("ORDER_NOT_FOUND", "Order not found");
  }
  return order;
}

function buildGatewayUrl(gateway: PaymentGateway, gatewayRef: string): string {
  // Placeholder — real implementation will call gateway SDK and return redirect URL
  const baseUrls: Record<PaymentGateway, string> = {
    zarinpal: "https://www.zarinpal.com/pg/StartPay",
    idpay: "https://idpay.ir/p/ws-sandbox",
    payir: "https://pay.ir/pg",
  };
  return `${baseUrls[gateway]}/${gatewayRef}`;
}

/* ── Phase 1: Upfront Payment (40–50%) ─────────────────────────── */

export async function initiatePhase1Payment(
  orderId: string,
  gateway: PaymentGateway,
): Promise<PaymentInitResult> {
  const order = await fetchOrderOrThrow(orderId);

  if (order.status !== "awaiting_phase1") {
    throw new PaymentError(
      "INVALID_ORDER_STATUS",
      `Cannot initiate phase 1 payment for order in status: ${order.status}`,
    );
  }

  // Re-calculate expected phase1 amount server-side (never trust stored value alone)
  const split = calculateSplit(order.totalRial, Number(order.splitRatio));
  if (split.phase1Rial !== order.phase1AmountRial) {
    throw new PaymentError(
      "AMOUNT_MISMATCH",
      "Server-calculated phase 1 amount does not match order record",
    );
  }

  // Placeholder gateway ref — real implementation calls gateway API
  const gatewayRef = `SR1-${orderId.slice(0, 8)}-${Date.now()}`;

  const newPayment: NewPayment = {
    orderId,
    phase: "phase_1",
    amountRial: split.phase1Rial,
    gateway,
    gatewayRef,
    status: "pending",
  };

  const [payment] = await db.insert(payments).values(newPayment).returning();

  return {
    paymentId: payment.id,
    gatewayUrl: buildGatewayUrl(gateway, gatewayRef),
  };
}

/* ── Confirm Phase 1 ───────────────────────────────────────────── */

export async function confirmPhase1Payment(
  paymentId: string,
  gatewayRef: string,
): Promise<Payment> {
  const [payment] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.id, paymentId), eq(payments.phase, "phase_1")))
    .limit(1);

  if (!payment) {
    throw new PaymentError("PAYMENT_NOT_FOUND", "Phase 1 payment record not found");
  }

  if (payment.status !== "pending") {
    throw new PaymentError(
      "INVALID_PAYMENT_STATUS",
      `Cannot confirm payment in status: ${payment.status}`,
    );
  }

  const now = new Date();

  // Update payment record
  const [updated] = await db
    .update(payments)
    .set({
      status: "success",
      gatewayRef,
      paidAt: now,
      updatedAt: now,
    })
    .where(eq(payments.id, paymentId))
    .returning();

  // Transition order to phase1_paid
  await db
    .update(orders)
    .set({
      status: "phase1_paid",
      phase1PaidAt: now,
      updatedAt: now,
    })
    .where(eq(orders.id, payment.orderId));

  return updated;
}

/* ── Phase 2: Remaining Payment (50–60%) ───────────────────────── */

export async function initiatePhase2Payment(
  orderId: string,
  gateway: PaymentGateway,
): Promise<PaymentInitResult> {
  const order = await fetchOrderOrThrow(orderId);

  if (order.status !== "awaiting_phase2" && order.status !== "phase2_overdue") {
    throw new PaymentError(
      "INVALID_ORDER_STATUS",
      `Cannot initiate phase 2 payment for order in status: ${order.status}`,
    );
  }

  // Re-calculate expected phase2 amount server-side
  const split = calculateSplit(order.totalRial, Number(order.splitRatio));
  if (split.phase2Rial !== order.phase2AmountRial) {
    throw new PaymentError(
      "AMOUNT_MISMATCH",
      "Server-calculated phase 2 amount does not match order record",
    );
  }

  const gatewayRef = `SR2-${orderId.slice(0, 8)}-${Date.now()}`;

  const newPayment: NewPayment = {
    orderId,
    phase: "phase_2",
    amountRial: split.phase2Rial,
    gateway,
    gatewayRef,
    status: "pending",
  };

  const [payment] = await db.insert(payments).values(newPayment).returning();

  return {
    paymentId: payment.id,
    gatewayUrl: buildGatewayUrl(gateway, gatewayRef),
  };
}

/* ── Confirm Phase 2 ───────────────────────────────────────────── */

export async function confirmPhase2Payment(
  paymentId: string,
  gatewayRef: string,
): Promise<Payment> {
  const [payment] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.id, paymentId), eq(payments.phase, "phase_2")))
    .limit(1);

  if (!payment) {
    throw new PaymentError("PAYMENT_NOT_FOUND", "Phase 2 payment record not found");
  }

  if (payment.status !== "pending") {
    throw new PaymentError(
      "INVALID_PAYMENT_STATUS",
      `Cannot confirm payment in status: ${payment.status}`,
    );
  }

  const now = new Date();

  const [updated] = await db
    .update(payments)
    .set({
      status: "success",
      gatewayRef,
      paidAt: now,
      updatedAt: now,
    })
    .where(eq(payments.id, paymentId))
    .returning();

  // Transition order to phase2_paid
  await db
    .update(orders)
    .set({
      status: "phase2_paid",
      phase2PaidAt: now,
      updatedAt: now,
    })
    .where(eq(orders.id, payment.orderId));

  return updated;
}

/* ── Query ──────────────────────────────────────────────────────── */

export async function getPaymentsByOrder(orderId: string): Promise<Payment[]> {
  return db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .orderBy(payments.createdAt);
}
