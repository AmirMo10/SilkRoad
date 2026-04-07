import { describe, it, expect } from "vitest";
import { quoteShipping, type ShippingRateRow } from "@/lib/shipping-calculator";

const turboRate: ShippingRateRow = {
  tier: "turbo",
  ratePerKgRial: 850_000n,
  baseCostRial: 5_000_000n,
  etaMinDays: 7,
  etaMaxDays: 15,
};

const economyRate: ShippingRateRow = {
  tier: "economy",
  ratePerKgRial: 150_000n,
  baseCostRial: 1_000_000n,
  etaMinDays: 45,
  etaMaxDays: 70,
};

describe("quoteShipping", () => {
  it("uses weight charge when weight dominates", () => {
    const items = [{ weightKg: 10, volumeCbm: 0.001, quantity: 1 }];
    const q = quoteShipping(items, turboRate);
    // weight: ceil(10) * 850000 = 8_500_000
    // volumetric: ceil(0.001*167)=1 * 850000 = 850_000
    // base 5_000_000 + max(8_500_000, 850_000) = 13_500_000
    expect(q.costRial).toBe(13_500_000n);
    expect(q.tier).toBe("turbo");
  });

  it("uses volumetric charge when volume dominates", () => {
    const items = [{ weightKg: 0.1, volumeCbm: 0.5, quantity: 1 }];
    const q = quoteShipping(items, economyRate);
    // weight: ceil(0.1)=1 * 150000 = 150_000
    // volumetric: ceil(0.5*167)=84 * 150000 = 12_600_000
    // base 1_000_000 + 12_600_000 = 13_600_000
    expect(q.costRial).toBe(13_600_000n);
  });

  it("multiplies by quantity", () => {
    const single = quoteShipping([{ weightKg: 1, volumeCbm: 0.001, quantity: 1 }], economyRate);
    const ten = quoteShipping([{ weightKg: 1, volumeCbm: 0.001, quantity: 10 }], economyRate);
    expect(ten.costRial).toBeGreaterThan(single.costRial);
  });

  it("returns ETA from rate row", () => {
    const q = quoteShipping([{ weightKg: 1, volumeCbm: 0.001, quantity: 1 }], turboRate);
    expect(q.etaMinDays).toBe(7);
    expect(q.etaMaxDays).toBe(15);
  });
});
