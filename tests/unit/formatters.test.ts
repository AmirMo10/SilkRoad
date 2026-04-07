import { describe, it, expect } from "vitest";
import { toPersianDigits, formatToman, formatMoq } from "@/lib/formatters";

describe("toPersianDigits", () => {
  it("converts Latin digits to Persian", () => {
    expect(toPersianDigits("12345")).toBe("۱۲۳۴۵");
  });
  it("preserves non-digit characters", () => {
    expect(toPersianDigits("abc 90")).toBe("abc ۹۰");
  });
});

describe("formatToman", () => {
  it("formats with thousands separator and Toman label", () => {
    expect(formatToman(1234567)).toBe("۱,۲۳۴,۵۶۷ تومان");
  });
  it("rounds floats", () => {
    expect(formatToman(99.6)).toBe("۱۰۰ تومان");
  });
});

describe("formatMoq", () => {
  it("formats MOQ with Persian digits", () => {
    expect(formatMoq(1000)).toBe("حداقل سفارش: ۱,۰۰۰ عدد");
  });
});
