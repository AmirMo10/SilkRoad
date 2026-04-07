const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/** Convert Latin digits in a string to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Format a Toman amount with thousands separators and Persian digits. */
export function formatToman(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  const grouped = Math.round(amount).toLocaleString("en-US");
  return `${toPersianDigits(grouped)} تومان`;
}

/** Format a minimum order quantity with Persian digits + label. */
export function formatMoq(qty: number): string {
  return `حداقل سفارش: ${toPersianDigits(qty.toLocaleString("en-US"))} عدد`;
}
