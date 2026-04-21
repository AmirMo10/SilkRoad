import { describe, it, expect } from "vitest";
import {
  computeSubtotalToman,
  computeTotals,
  isCartValid,
  FALLBACK_SHIPPING_RATES,
} from "@/lib/cart-math";
import type { CartLine } from "@/stores/cart.store";

/** Helper to build a minimal CartLine for testing. */
function makeLine(overrides: Partial<CartLine> = {}): CartLine {
  return {
    productId: "p1",
    slug: "test-product",
    nameFa: "محصول تست",
    nameEn: "Test Product",
    iconSlug: "box",
    priceToman: 50_000,
    moq: 100,
    quantityStep: 100,
    weightKg: 0.5,
    volumeCbm: 0.001,
    quantity: 100,
    ...overrides,
  };
}

/* ── computeSubtotalToman ─────────────────────────────────────────── */

describe("computeSubtotalToman", () => {
  it("returns 0 for an empty array", () => {
    expect(computeSubtotalToman([])).toBe(0);
  });

  it("computes subtotal for a single item", () => {
    const lines = [makeLine({ priceToman: 10_000, quantity: 200 })];
    expect(computeSubtotalToman(lines)).toBe(2_000_000);
  });

  it("sums multiple items with different prices and quantities", () => {
    const lines = [
      makeLine({ productId: "a", priceToman: 10_000, quantity: 100 }),
      makeLine({ productId: "b", priceToman: 25_000, quantity: 500 }),
    ];
    // 10_000*100 + 25_000*500 = 1_000_000 + 12_500_000 = 13_500_000
    expect(computeSubtotalToman(lines)).toBe(13_500_000);
  });
});

/* ── computeTotals ────────────────────────────────────────────────── */

describe("computeTotals", () => {
  it("returns zero totals for empty cart", () => {
    const totals = computeTotals([], "normal", 0.5, FALLBACK_SHIPPING_RATES);
    expect(totals.subtotalToman).toBe(0);
    expect(totals.totalToman).toBeGreaterThanOrEqual(0);
    expect(totals.phase1Toman + totals.phase2Toman).toBe(totals.totalToman);
  });

  it("computes correct subtotal for a single item", () => {
    const lines = [makeLine({ priceToman: 20_000, quantity: 100 })];
    const totals = computeTotals(lines, "normal", 0.5, FALLBACK_SHIPPING_RATES);
    expect(totals.subtotalToman).toBe(2_000_000);
  });

  it("includes shipping cost in total", () => {
    const lines = [makeLine({ priceToman: 20_000, quantity: 100 })];
    const totals = computeTotals(lines, "normal", 0.5, FALLBACK_SHIPPING_RATES);
    expect(totals.shippingToman).toBeGreaterThan(0);
    expect(totals.totalToman).toBe(totals.subtotalToman + totals.shippingToman);
  });

  it("phase1 + phase2 always equals total (no rounding drift)", () => {
    const lines = [
      makeLine({ productId: "a", priceToman: 12_345, quantity: 137 }),
      makeLine({ productId: "b", priceToman: 67_890, quantity: 250 }),
    ];
    const totals = computeTotals(lines, "turbo", 0.45, FALLBACK_SHIPPING_RATES);
    expect(totals.phase1Toman + totals.phase2Toman).toBe(totals.totalToman);
  });

  it("turbo shipping costs more than economy", () => {
    const lines = [makeLine({ weightKg: 2, quantity: 500 })];
    const turbo = computeTotals(lines, "turbo", 0.5, FALLBACK_SHIPPING_RATES);
    const economy = computeTotals(lines, "economy", 0.5, FALLBACK_SHIPPING_RATES);
    expect(turbo.shippingToman).toBeGreaterThan(economy.shippingToman);
  });

  it("returns correct ETA range per tier", () => {
    const lines = [makeLine()];
    const turbo = computeTotals(lines, "turbo", 0.5, FALLBACK_SHIPPING_RATES);
    const economy = computeTotals(lines, "economy", 0.5, FALLBACK_SHIPPING_RATES);
    expect(turbo.etaMinDays).toBe(7);
    expect(turbo.etaMaxDays).toBe(15);
    expect(economy.etaMinDays).toBe(45);
    expect(economy.etaMaxDays).toBe(70);
  });
});

/* ── isCartValid ──────────────────────────────────────────────────── */

describe("isCartValid", () => {
  it("returns false for an empty cart", () => {
    expect(isCartValid([])).toBe(false);
  });

  it("returns false when any item quantity is below its MOQ", () => {
    const lines = [
      makeLine({ productId: "a", moq: 100, quantity: 100 }),
      makeLine({ productId: "b", moq: 500, quantity: 200 }), // below MOQ
    ];
    expect(isCartValid(lines)).toBe(false);
  });

  it("returns true when all quantities meet MOQ exactly", () => {
    const lines = [
      makeLine({ productId: "a", moq: 100, quantity: 100 }),
      makeLine({ productId: "b", moq: 500, quantity: 500 }),
    ];
    expect(isCartValid(lines)).toBe(true);
  });

  it("returns true when quantities exceed MOQ", () => {
    const lines = [
      makeLine({ productId: "a", moq: 100, quantity: 1000 }),
    ];
    expect(isCartValid(lines)).toBe(true);
  });
});
