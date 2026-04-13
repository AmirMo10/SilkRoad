/**
 * Shipping cost & ETA calculator.
 *
 * Internal math uses bigint Rial for precision (ADR 004).
 * Convenience functions return Toman (number) for UI display.
 *
 * cost = base_cost + max(weight_charge, volume_charge)
 * weight_charge = ceil(total_weight_kg) × rate_per_kg
 * volume_charge = total_volume_cbm × 167 × rate_per_kg
 */

export type ShippingTier = "turbo" | "normal" | "economy";

export interface ShippingRateRow {
  tier: ShippingTier;
  ratePerKgRial: bigint;
  baseCostRial: bigint;
  etaMinDays: number;
  etaMaxDays: number;
}

export interface CartItem {
  weightKg: number;
  volumeCbm: number;
  quantity: number;
}

export interface ShippingQuote {
  tier: ShippingTier;
  costRial: bigint;
  etaMinDays: number;
  etaMaxDays: number;
}

/** Toman-friendly quote for UI components. */
export interface ShippingQuoteToman {
  tier: ShippingTier;
  costToman: number;
  etaMinDays: number;
  etaMaxDays: number;
}

/** Static config per tier — icon slug for the UI. */
export interface TierMeta {
  tier: ShippingTier;
  icon: string;
}

const VOLUMETRIC_FACTOR = 167;

/* ── Rate table (will come from DB later, hardcoded for now) ────── */

const RATES: Record<ShippingTier, ShippingRateRow> = {
  turbo: {
    tier: "turbo",
    ratePerKgRial: 260_000n, // 26,000 Toman/kg
    baseCostRial: 50_000_000n, // 5,000,000 Toman base
    etaMinDays: 7,
    etaMaxDays: 15,
  },
  normal: {
    tier: "normal",
    ratePerKgRial: 130_000n, // 13,000 Toman/kg
    baseCostRial: 25_000_000n, // 2,500,000 Toman base
    etaMinDays: 20,
    etaMaxDays: 35,
  },
  economy: {
    tier: "economy",
    ratePerKgRial: 55_000n, // 5,500 Toman/kg
    baseCostRial: 10_000_000n, // 1,000,000 Toman base
    etaMinDays: 45,
    etaMaxDays: 70,
  },
};

export const TIER_META: Record<ShippingTier, TierMeta> = {
  turbo: { tier: "turbo", icon: "bolt" },
  normal: { tier: "normal", icon: "package" },
  economy: { tier: "economy", icon: "wave" },
};

/** All tiers in display order (fastest → slowest). */
export const TIERS: ShippingTier[] = ["turbo", "normal", "economy"];

/* ── Core calculator (bigint Rial) ──────────────────────────────── */

export function quoteShipping(items: CartItem[], rate: ShippingRateRow): ShippingQuote {
  const totalWeightKg = items.reduce((sum, i) => sum + i.weightKg * i.quantity, 0);
  const totalVolumeCbm = items.reduce((sum, i) => sum + i.volumeCbm * i.quantity, 0);

  const weightCharge = BigInt(Math.ceil(totalWeightKg)) * rate.ratePerKgRial;
  const volumetricKg = Math.ceil(totalVolumeCbm * VOLUMETRIC_FACTOR);
  const volumeCharge = BigInt(volumetricKg) * rate.ratePerKgRial;

  const variableCharge = weightCharge > volumeCharge ? weightCharge : volumeCharge;
  const costRial = rate.baseCostRial + variableCharge;

  return {
    tier: rate.tier,
    costRial,
    etaMinDays: rate.etaMinDays,
    etaMaxDays: rate.etaMaxDays,
  };
}

/* ── Convenience: Toman-based for UI ────────────────────────────── */

function rialToToman(rial: bigint): number {
  return Number(rial / 10n);
}

/** Quote a single tier using the built-in rate table. Returns Toman. */
export function quoteShippingToman(items: CartItem[], tier: ShippingTier): ShippingQuoteToman {
  const quote = quoteShipping(items, RATES[tier]);
  return {
    tier: quote.tier,
    costToman: rialToToman(quote.costRial),
    etaMinDays: quote.etaMinDays,
    etaMaxDays: quote.etaMaxDays,
  };
}

/** Quote all three tiers at once. Returns Toman. */
export function quoteAllTiers(items: CartItem[]): Record<ShippingTier, ShippingQuoteToman> {
  return {
    turbo: quoteShippingToman(items, "turbo"),
    normal: quoteShippingToman(items, "normal"),
    economy: quoteShippingToman(items, "economy"),
  };
}

/** Get the rate row for a tier (for server-side use with bigint). */
export function getRate(tier: ShippingTier): ShippingRateRow {
  return RATES[tier];
}
