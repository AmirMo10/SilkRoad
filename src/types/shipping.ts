/** The three shipping tiers from China to Iran. */
export type ShippingTier = "turbo" | "normal" | "economy";

/** ETA range in business days. */
export interface EtaRange {
  minDays: number;
  maxDays: number;
}

/** Shipping cost + ETA quote for a single tier. */
export interface ShippingQuote {
  tier: ShippingTier;
  costToman: number;
  eta: EtaRange;
}

/** Static config for each shipping tier. */
export interface TierConfig {
  tier: ShippingTier;
  /** Cost per chargeable kg in Toman. */
  ratePerKg: number;
  /** Minimum shipping charge in Toman. */
  minCharge: number;
  eta: EtaRange;
  icon: string;
}
