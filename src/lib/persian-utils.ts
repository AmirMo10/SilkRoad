/**
 * Persian/Iranian utilities — phone validation, digit conversion.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

/** Convert any Latin or Arabic-Indic digits to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input)
    .replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)])
    .replace(/[٠-٩]/g, (d) => PERSIAN_DIGITS[ARABIC_DIGITS.indexOf(d as (typeof ARABIC_DIGITS)[number])]);
}

/** Convert Persian/Arabic digits back to Latin (for storage/parsing). */
export function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d as (typeof PERSIAN_DIGITS)[number])))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d as (typeof ARABIC_DIGITS)[number])));
}

/**
 * Validate an Iranian mobile number.
 * Accepts: 09XXXXXXXXX, 9XXXXXXXXX, +989XXXXXXXXX, 00989XXXXXXXXX, with Persian digits.
 * Returns the normalized form `09XXXXXXXXX` or null if invalid.
 */
export function normalizeIranianMobile(raw: string): string | null {
  if (!raw) return null;
  const digits = toLatinDigits(raw).replace(/[\s\-()]/g, "");
  let n = digits;
  if (n.startsWith("+98")) n = "0" + n.slice(3);
  else if (n.startsWith("0098")) n = "0" + n.slice(4);
  else if (n.startsWith("98") && n.length === 12) n = "0" + n.slice(2);
  else if (n.startsWith("9") && n.length === 10) n = "0" + n;

  if (/^09\d{9}$/.test(n)) return n;
  return null;
}

export function isValidIranianMobile(raw: string): boolean {
  return normalizeIranianMobile(raw) !== null;
}
