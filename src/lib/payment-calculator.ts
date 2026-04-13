/**
 * Split-payment calculation per ADR 003.
 * Phase 1 = round(total × ratio); Phase 2 = total - Phase 1.
 * This guarantees phase1 + phase2 == total exactly (no rounding drift).
 */

import type { PaymentStatus, PaymentStep } from "@/types/payment";

/* ─── Core Rial-based types & function ─── */

export interface SplitPayment {
  totalRial: bigint;
  ratio: number;
  phase1Rial: bigint;
  phase2Rial: bigint;
}

export function calculateSplit(totalRial: bigint, ratio: number): SplitPayment {
  if (totalRial < 0n) throw new Error("totalRial must be non-negative");
  if (ratio < 0.4 || ratio > 0.5) throw new Error("ratio must be between 0.40 and 0.50");

  // Use integer math: ratio * 100 to avoid float drift
  const ratioPct = Math.round(ratio * 100);
  const phase1Rial = (totalRial * BigInt(ratioPct)) / 100n;
  const phase2Rial = totalRial - phase1Rial;

  return { totalRial, ratio, phase1Rial, phase2Rial };
}

/* ─── Toman convenience layer ─── */

export interface SplitPaymentToman {
  totalToman: number;
  ratio: number;
  /** Percentage as integer, e.g. 50 */
  phase1Pct: number;
  phase2Pct: number;
  phase1Toman: number;
  phase2Toman: number;
}

/**
 * Calculate split amounts in Toman (user-facing).
 * Uses bigint Rial internally to avoid floating-point drift,
 * then converts back to Toman (÷ 10).
 */
export function calculateSplitToman(
  totalToman: number,
  ratio = 0.5,
): SplitPaymentToman {
  const totalRial = BigInt(Math.round(totalToman * 10));
  const split = calculateSplit(totalRial, ratio);
  const pct = Math.round(ratio * 100);

  return {
    totalToman,
    ratio,
    phase1Pct: pct,
    phase2Pct: 100 - pct,
    phase1Toman: Number(split.phase1Rial) / 10,
    phase2Toman: Number(split.phase2Rial) / 10,
  };
}

/* ─── Payment status timeline ─── */

/** Ordered list of statuses in the split-payment lifecycle. */
export const PAYMENT_STATUS_ORDER: PaymentStatus[] = [
  "pending",
  "upfront_paid",
  "shipped",
  "arrived_in_iran",
  "remaining_paid",
  "delivered",
];

/**
 * Build a timeline of payment steps, marking which ones are completed
 * and which is current, given the order's current status.
 */
export function buildPaymentTimeline(
  currentStatus: PaymentStatus,
  labels: Record<PaymentStatus, string>,
  descriptions?: Partial<Record<PaymentStatus, string>>,
): PaymentStep[] {
  const currentIdx = PAYMENT_STATUS_ORDER.indexOf(currentStatus);

  return PAYMENT_STATUS_ORDER.map((key, i) => ({
    key,
    label: labels[key],
    description: descriptions?.[key],
    completedAt: i < currentIdx ? new Date() : null, // placeholder dates
    isCurrent: i === currentIdx,
  }));
}
