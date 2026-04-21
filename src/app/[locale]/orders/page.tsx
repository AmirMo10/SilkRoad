import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import Link from "next/link";

export default function OrdersPage() {
  const t = useTranslations("orders.list");
  const tStatus = useTranslations("orders.status");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] px-6 py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-[var(--sr-fg-muted)] opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
        <h2 className="mb-2 text-xl font-bold">{t("empty")}</h2>
        <p className="mb-6 max-w-sm text-sm text-[var(--sr-fg-muted)]">
          {t("emptyDesc")}
        </p>
        <Link
          href="/products"
          className="rounded-xl bg-[var(--sr-gold-500)] px-6 py-2.5 font-semibold text-[var(--sr-navy-950)] transition hover:brightness-110"
        >
          {t("browseProducts")}
        </Link>
      </div>
    </div>
  );
}
