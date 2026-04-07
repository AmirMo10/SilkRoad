export const locales = ["fa", "en"] as const;
export const defaultLocale = "fa" as const;
export type Locale = (typeof locales)[number];

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

export const localeNames: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};
