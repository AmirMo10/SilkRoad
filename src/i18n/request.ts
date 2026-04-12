import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (locales.includes(requested as Locale) ? requested : defaultLocale) as Locale;

  try {
    const messages = {
      common: (await import(`./messages/${locale}/common.json`)).default,
      home: (await import(`./messages/${locale}/home.json`)).default,
      products: (await import(`./messages/${locale}/products.json`)).default,
      shipping: (await import(`./messages/${locale}/shipping.json`)).default,
      checkout: (await import(`./messages/${locale}/checkout.json`)).default,
      cart: (await import(`./messages/${locale}/cart.json`)).default,
      errors: (await import(`./messages/${locale}/errors.json`)).default,
    };
    return { locale, messages };
  } catch {
    notFound();
  }
});
