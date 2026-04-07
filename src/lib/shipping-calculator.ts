/**
 * Shipping cost & ETA calculator per ADR 004.
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

const VOLUMETRIC_FACTOR = 167;

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
