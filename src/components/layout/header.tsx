import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { AuthButton } from "./auth-button";

export async function Header() {
  const t = await getTranslations("common");
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-50 sr-glass border-b border-[var(--sr-glass-border)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[var(--sr-gold-400)]">{t("brand.name")}</span>
          <span className="text-xs text-[var(--sr-fg-muted)]">SilkRoad</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--sr-fg-muted)]">
          <Link href={`/${locale}/products`} className="hover:text-[var(--sr-fg)] transition-colors">
            {t("nav.products")}
          </Link>
          <Link href={`/${locale}/how-it-works`} className="hover:text-[var(--sr-fg)] transition-colors">
            {t("nav.howItWorks")}
          </Link>
          <Link href={`/${locale}/shipping-info`} className="hover:text-[var(--sr-fg)] transition-colors">
            {t("nav.shipping")}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-[var(--sr-fg)] transition-colors">
            {t("nav.about")}
          </Link>
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}
