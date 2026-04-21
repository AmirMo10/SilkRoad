import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, normaliseQuantity } from "@/stores/cart.store";
import type { CartLine } from "@/stores/cart.store";

/** Helper to build an add-ready line payload. */
function makeAddPayload(overrides: Partial<Omit<CartLine, "quantity"> & { quantity?: number }> = {}) {
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
    ...overrides,
  };
}

/* ── normaliseQuantity (pure function) ────────────────────────────── */

describe("normaliseQuantity", () => {
  it("snaps below-MOQ values up to MOQ", () => {
    expect(normaliseQuantity(50, 100, 100)).toBe(100);
  });

  it("keeps exact MOQ as-is", () => {
    expect(normaliseQuantity(100, 100, 100)).toBe(100);
  });

  it("snaps above-MOQ to next valid step", () => {
    // MOQ 100, step 100 → valid: 100, 200, 300 …
    expect(normaliseQuantity(150, 100, 100)).toBe(200);
  });

  it("keeps exact step multiples above MOQ", () => {
    expect(normaliseQuantity(300, 100, 100)).toBe(300);
  });

  it("handles step of 1", () => {
    expect(normaliseQuantity(137, 100, 1)).toBe(137);
  });
});

/* ── Zustand cart store ───────────────────────────────────────────── */

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ lines: [], shippingTier: "normal", splitRatio: 0.5 });
  });

  it("starts with an empty cart", () => {
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("add() inserts a new line with quantity defaulting to MOQ", () => {
    useCartStore.getState().add(makeAddPayload({ moq: 200 }));
    const lines = useCartStore.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].productId).toBe("p1");
    expect(lines[0].quantity).toBe(200);
  });

  it("add() with explicit quantity normalises to valid step", () => {
    useCartStore.getState().add(makeAddPayload({ moq: 100, quantityStep: 100, quantity: 150 }));
    const lines = useCartStore.getState().lines;
    expect(lines[0].quantity).toBe(200); // snapped up
  });

  it("add() same product increments quantity", () => {
    const payload = makeAddPayload({ moq: 100, quantityStep: 100 });
    useCartStore.getState().add(payload);
    useCartStore.getState().add(payload); // add again
    const lines = useCartStore.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(200); // 100 + 100
  });

  it("setQuantity updates the quantity for the given product", () => {
    useCartStore.getState().add(makeAddPayload());
    useCartStore.getState().setQuantity("p1", 500);
    expect(useCartStore.getState().lines[0].quantity).toBe(500);
  });

  it("setQuantity below MOQ snaps to MOQ", () => {
    useCartStore.getState().add(makeAddPayload({ moq: 100, quantityStep: 100 }));
    useCartStore.getState().setQuantity("p1", 10);
    expect(useCartStore.getState().lines[0].quantity).toBe(100);
  });

  it("remove() removes the specified line", () => {
    useCartStore.getState().add(makeAddPayload({ productId: "a" }));
    useCartStore.getState().add(makeAddPayload({ productId: "b" }));
    useCartStore.getState().remove("a");
    const lines = useCartStore.getState().lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].productId).toBe("b");
  });

  it("clear() empties the entire cart", () => {
    useCartStore.getState().add(makeAddPayload({ productId: "a" }));
    useCartStore.getState().add(makeAddPayload({ productId: "b" }));
    useCartStore.getState().clear();
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("setShippingTier updates the tier", () => {
    useCartStore.getState().setShippingTier("turbo");
    expect(useCartStore.getState().shippingTier).toBe("turbo");
  });
});
