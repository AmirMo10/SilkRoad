"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { CartItemRow } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/hooks/use-cart";
import { computeTotals, isCartValid } from "@/lib/cart-math";
import { formatToman, toPersianDigits } from "@/lib/formatters";

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations("cart");
  const { lines, shippingTier, splitRatio, hydrated } = useCart();

  const fmtMoney = (toman: number) =>
    locale === "fa" ? formatToman(toman) : `${toman.toLocaleString("en-US")} Toman`;

  const totals = computeTotals(lines, shippingTier, splitRatio);
  const valid = isCartValid(lines);
  const ratioPct = Math.round(splitRatio * 100);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("page.title")}</h1>
          <p className="mt-2 text-[var(--sr-fg-muted)]">{t("page.subtitle")}</p>
        </header>

        {!hydrated ? (
          <div className="text-[var(--sr-fg-muted)]">…</div>
        ) : lines.length === 0 ? (
          <Card className="text-center">
            <p className="mb-4 text-lg">{t("page.empty")}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex h-12 items-center rounded-[var(--sr-radius)] bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] px-6 font-semibold text-[var(--sr-navy-950)] hover:brightness-110"
            >
              {t("page.emptyCta")}
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div className="flex flex-col gap-4">
              {lines.map((line) => (
                <CartItemRow
                  key={line.productId}
                  line={line}
                  locale={locale}
                  labels={{
                    remove: t("item.remove"),
                    moqWarning: t("item.moqWarning"),
                    perUnit: t("item.perUnit"),
                    lineTotal: t("item.lineTotal"),
                  }}
                />
              ))}
            </div>

            <CartSummary
              locale={locale}
              subtotal={fmtMoney(totals.subtotalToman)}
              shipping={fmtMoney(totals.shippingToman)}
              total={fmtMoney(totals.totalToman)}
              phase1={fmtMoney(totals.phase1Toman)}
              phase2={fmtMoney(totals.phase2Toman)}
              ratioPct={ratioPct}
              canCheckout={valid}
              moqError={valid ? undefined : t("summary.moqError")}
              labels={{
                summary: t("summary.title"),
                subtotal: t("summary.subtotal"),
                shipping: t("summary.shipping"),
                total: t("summary.total"),
                splitTitle: t("summary.splitTitle"),
                phase1: t("summary.phase1"),
                phase1Desc: t("summary.phase1Desc"),
                phase2: t("summary.phase2"),
                phase2Desc: t("summary.phase2Desc"),
                proceed: t("summary.proceed"),
                secure: t("summary.secure"),
              }}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
