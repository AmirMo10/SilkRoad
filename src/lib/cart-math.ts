/**
 * Pure cart math. All inputs/outputs in Toman (as JS `number`) so they're
 * trivially serialisable. The Rial bigint math is only used inside the
 * shared shipping/payment calculators.
 */

import type { CartLine } from "@/stores/cart.store";
import { quoteShipping, type ShippingRateRow, type ShippingTier } from "@/lib/shipping-calculator";
import { calculateSplit } from "@/lib/payment-calculator";

export interface CartTotals {
  subtotalToman: number;
  shippingToman: number;
  totalToman: number;
  phase1Toman: number;
  phase2Toman: number;
  etaMinDays: number;
  etaMaxDays: number;
}

/** Seeded fallback rates used when no DB data is available (e.g. preview builds). */
export const FALLBACK_SHIPPING_RATES: Record<ShippingTier, ShippingRateRow> = {
  turbo: {
    tier: "turbo",
    ratePerKgRial: 1_200_000n,
    baseCostRial: 5_000_000n,
    etaMinDays: 7,
    etaMaxDays: 15,
  },
  normal: {
    tier: "normal",
    ratePerKgRial: 600_000n,
    baseCostRial: 3_000_000n,
    etaMinDays: 20,
    etaMaxDays: 35,
  },
  economy: {
    tier: "economy",
    ratePerKgRial: 250_000n,
    baseCostRial: 1_500_000n,
    etaMinDays: 45,
    etaMaxDays: 70,
  },
};

export function computeSubtotalToman(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.priceToman * l.quantity, 0);
}

export function computeTotals(
  lines: CartLine[],
  tier: ShippingTier,
  splitRatio: number,
  rates: Record<ShippingTier, ShippingRateRow> = FALLBACK_SHIPPING_RATES,
): CartTotals {
  const subtotalToman = computeSubtotalToman(lines);

  const quote = quoteShipping(
    lines.map((l) => ({
      weightKg: l.weightKg,
      volumeCbm: l.volumeCbm,
      quantity: l.quantity,
    })),
    rates[tier],
  );
  const shippingToman = Number(quote.costRial) / 10;

  const totalToman = subtotalToman + shippingToman;

  // Use the bigint splitter for exact phase1+phase2 == total.
  const split = calculateSplit(BigInt(Math.round(totalToman * 10)), splitRatio);
  const phase1Toman = Number(split.phase1Rial) / 10;
  const phase2Toman = Number(split.phase2Rial) / 10;

  return {
    subtotalToman,
    shippingToman,
    totalToman,
    phase1Toman,
    phase2Toman,
    etaMinDays: quote.etaMinDays,
    etaMaxDays: quote.etaMaxDays,
  };
}

export function isCartValid(lines: CartLine[]): boolean {
  return lines.length > 0 && lines.every((l) => l.quantity >= l.moq);
}
