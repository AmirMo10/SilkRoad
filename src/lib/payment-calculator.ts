/**
 * Split-payment calculation per ADR 003.
 * Phase 1 = round(total × ratio); Phase 2 = total - Phase 1.
 * This guarantees phase1 + phase2 == total exactly (no rounding drift).
 */

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
