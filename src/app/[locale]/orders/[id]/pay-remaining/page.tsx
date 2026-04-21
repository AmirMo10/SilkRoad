import { useTranslations } from "next-intl";
import Link from "next/link";

export default async function PayRemainingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = useTranslations("orders");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Link
        href={`/${locale}/orders`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--sr-fg-muted)] transition hover:text-[var(--sr-fg)]"
      >
        &larr; {t("backToOrders")}
      </Link>

      <div className="rounded-2xl border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] p-6">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-black">{t("payRemaining")}</h1>
        </div>

        <div className="mb-6 rounded-xl border border-[var(--sr-gold-500)]/20 bg-[var(--sr-gold-500)]/5 p-4 text-sm">
          {t("remainingCta")}
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold">{t("orderSummary")}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--sr-fg-muted)]">
                {t("orderNumber")}
              </span>
              <code className="font-mono text-[var(--sr-gold-300)]">{id}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--sr-fg-muted)]">
                {t("phase1.title")}
              </span>
              <span className="font-semibold text-green-400">{t("paid")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--sr-fg-muted)]">
                {t("phase2.title")}
              </span>
              <span className="font-semibold text-amber-400">
                {t("unpaid")}
              </span>
            </div>
          </div>
        </div>

        <button className="w-full rounded-xl bg-[var(--sr-gold-500)] py-3 text-center font-bold text-[var(--sr-navy-950)] transition hover:brightness-110">
          {t("payNow")}
        </button>
      </div>
    </div>
  );
}
