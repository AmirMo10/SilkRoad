/** Payment phase within the split-payment model. */
export type PaymentPhase = "phase1" | "phase2";

/**
 * Order payment status — tracks progress through the split-payment lifecycle.
 * Matches ADR 006 state machine.
 */
export type PaymentStatus =
  | "pending"            // Order placed, no payment yet
  | "upfront_paid"       // Phase 1 (40-50%) paid — order confirmed
  | "shipped"            // Goods shipped from China
  | "arrived_in_iran"    // Goods cleared customs, awaiting Phase 2
  | "remaining_paid"     // Phase 2 paid in full
  | "delivered"          // Last-mile delivery complete
  | "cancelled"          // Order cancelled (overdue / refund)
  | "refund_pending";    // Refund in progress

/** A single payment record for one phase. */
export interface PhasePayment {
  phase: PaymentPhase;
  amountRial: bigint;
  amountToman: number;
  /** Percentage of total (e.g. 50) */
  percentage: number;
  paidAt: Date | null;
  status: "unpaid" | "paid" | "overdue" | "refunded";
}

/** Full split-payment breakdown for an order. */
export interface SplitPaymentDetail {
  orderId: string;
  totalRial: bigint;
  totalToman: number;
  ratio: number;
  phase1: PhasePayment;
  phase2: PhasePayment;
  currentStatus: PaymentStatus;
}

/** Status step for the payment progress timeline. */
export interface PaymentStep {
  key: PaymentStatus;
  label: string;
  description?: string;
  completedAt: Date | null;
  isCurrent: boolean;
}
