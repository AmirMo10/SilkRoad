import { describe, it, expect } from "vitest";
import { calculateSplit } from "@/lib/payment-calculator";

describe("calculateSplit", () => {
  it("splits exactly 50/50 with no remainder", () => {
    const result = calculateSplit(10_000_000n, 0.5);
    expect(result.phase1Rial).toBe(5_000_000n);
    expect(result.phase2Rial).toBe(5_000_000n);
    expect(result.phase1Rial + result.phase2Rial).toBe(10_000_000n);
  });

  it("handles 40/60 split", () => {
    const result = calculateSplit(1_000_000n, 0.4);
    expect(result.phase1Rial).toBe(400_000n);
    expect(result.phase2Rial).toBe(600_000n);
  });

  it("phase1 + phase2 always equals total (no rounding drift)", () => {
    const result = calculateSplit(1_234_567n, 0.45);
    expect(result.phase1Rial + result.phase2Rial).toBe(1_234_567n);
  });

  it("rejects ratio above 0.5", () => {
    expect(() => calculateSplit(1000n, 0.51)).toThrow();
  });

  it("rejects ratio below 0.4", () => {
    expect(() => calculateSplit(1000n, 0.39)).toThrow();
  });

  it("rejects negative total", () => {
    expect(() => calculateSplit(-1n, 0.5)).toThrow();
  });
});
