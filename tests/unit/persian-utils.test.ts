import { describe, it, expect } from "vitest";
import { normalizeIranianMobile, isValidIranianMobile, toLatinDigits, toPersianDigits } from "@/lib/persian-utils";

describe("normalizeIranianMobile", () => {
  it("accepts standard 09XXXXXXXXX", () => {
    expect(normalizeIranianMobile("09123456789")).toBe("09123456789");
  });
  it("normalizes +98 prefix", () => {
    expect(normalizeIranianMobile("+989123456789")).toBe("09123456789");
  });
  it("normalizes 0098 prefix", () => {
    expect(normalizeIranianMobile("00989123456789")).toBe("09123456789");
  });
  it("normalizes bare 9XXXXXXXXX", () => {
    expect(normalizeIranianMobile("9123456789")).toBe("09123456789");
  });
  it("strips spaces and dashes", () => {
    expect(normalizeIranianMobile("0912-345 6789")).toBe("09123456789");
  });
  it("converts Persian digits", () => {
    expect(normalizeIranianMobile("۰۹۱۲۳۴۵۶۷۸۹")).toBe("09123456789");
  });
  it("rejects too-short", () => {
    expect(normalizeIranianMobile("0912345")).toBeNull();
  });
  it("rejects non-09 prefix", () => {
    expect(normalizeIranianMobile("0212345678")).toBeNull();
  });
});

describe("isValidIranianMobile", () => {
  it("returns true for valid", () => {
    expect(isValidIranianMobile("09123456789")).toBe(true);
  });
  it("returns false for invalid", () => {
    expect(isValidIranianMobile("not a phone")).toBe(false);
  });
});

describe("toLatinDigits / toPersianDigits", () => {
  it("converts Persian to Latin and back", () => {
    expect(toLatinDigits("۱۲۳۴۵")).toBe("12345");
    expect(toPersianDigits("12345")).toBe("۱۲۳۴۵");
  });
});
