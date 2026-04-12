"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { ShippingTierSelector } from "@/components/cart/shipping-tier-selector";
import { useCart } from "@/hooks/use-cart";
import { computeTotals, FALLBACK_SHIPPING_RATES, isCartValid } from "@/lib/cart-math";
import { quoteShipping, type ShippingTier } from "@/lib/shipping-calculator";
import { formatToman, toPersianDigits } from "@/lib/formatters";

const TIERS: ShippingTier[] = ["turbo", "normal", "economy"];

export default function CheckoutPage() {
  const locale = useLocale();
  const tCheckout = useTranslations("checkout");
  const tShipping = useTranslations("shipping");
  const { lines, shippingTier, splitRatio, clear, hydrated } = useCart();
  const [placed, setPlaced] = useState(false);

  const fmtMoney = (toman: number) =>
    locale === "fa" ? formatToman(toman) : `${toman.toLocaleString("en-US")} Toman`;

  const fmtDays = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toString()) : n.toString();

  const totals = computeTotals(lines, shippingTier, splitRatio);

  // Per-tier cost preview (so the tier cards show the delta)
  const tierCosts: Record<ShippingTier, string> = {
    turbo: "",
    normal: "",
    economy: "",
  };
  for (const tier of TIERS) {
    const quote = quoteShipping(
      lines.map((l) => ({ weightKg: l.weightKg, volumeCbm: l.volumeCbm, quantity: l.quantity })),
      FALLBACK_SHIPPING_RATES[tier],
    );
    tierCosts[tier] = fmtMoney(Number(quote.costRial) / 10);
  }

  const tierLabels = {
    turbo: {
      name: tShipping("tier.turbo.name"),
      description: tShipping("tier.turbo.description"),
      eta: tShipping("tier.turbo.eta"),
    },
    normal: {
      name: tShipping("tier.normal.name"),
      description: tShipping("tier.normal.description"),
      eta: tShipping("tier.normal.eta"),
    },
    economy: {
      name: tShipping("tier.economy.name"),
      description: tShipping("tier.economy.description"),
      eta: tShipping("tier.economy.eta"),
    },
  };

  const valid = isCartValid(lines);

  if (placed) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16">
          <Card className="text-center">
            <Badge className="mb-3">
              <Icon name="check" size={14} strokeWidth={2} />
              {tCheckout("success.title")}
            </Badge>
            <h1 className="mb-4 text-3xl font-extrabold">{tCheckout("success.title")}</h1>
            <p className="mx-auto mb-6 max-w-xl text-[var(--sr-fg-muted)]">
              {tCheckout("success.description")}
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex h-12 items-center rounded-[var(--sr-radius)] bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] px-6 font-semibold text-[var(--sr-navy-950)] hover:brightness-110"
            >
              {tCheckout("success.backHome")}
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {tCheckout("page.title")}
          </h1>
          <p className="mt-2 text-[var(--sr-fg-muted)]">{tCheckout("page.subtitle")}</p>
        </header>

        {!hydrated || lines.length === 0 ? (
          <Card>
            <Link
              href={`/${locale}/cart`}
              className="text-[var(--sr-gold-300)] hover:underline"
            >
              ← {tCheckout("actions.backToCart")}
            </Link>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="flex flex-col gap-8">
              <ShippingTierSelector
                heading={tCheckout("shippingTier.heading")}
                labels={tierLabels}
                costs={tierCosts}
              />

              <section>
                <h3 className="mb-4 text-lg font-bold">{tCheckout("splitPayment.title")}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <Badge className="mb-2">
                      <Icon name="coin" size={12} strokeWidth={2} />
                      {tCheckout("splitPayment.phase1Heading")}
                    </Badge>
                    <div className="text-xs text-[var(--sr-fg-muted)]">
                      {tCheckout("splitPayment.phase1Description")}
                    </div>
                    <div className="mt-3 text-2xl font-bold text-[var(--sr-gold-400)]">
                      {fmtMoney(totals.phase1Toman)}
                    </div>
                  </Card>
                  <Card>
                    <Badge className="mb-2">
                      <Icon name="truck" size={12} strokeWidth={2} />
                      {tCheckout("splitPayment.phase2Heading")}
                    </Badge>
                    <div className="text-xs text-[var(--sr-fg-muted)]">
                      {tCheckout("splitPayment.phase2Description")}
                    </div>
                    <div className="mt-3 text-2xl font-bold text-[var(--sr-gold-400)]">
                      {fmtMoney(totals.phase2Toman)}
                    </div>
                  </Card>
                </div>
              </section>
            </div>

            <Card className="sticky top-20 h-fit">
              <h3 className="mb-4 text-lg font-bold">{tCheckout("review.heading")}</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--sr-fg-muted)]">{tCheckout("review.subtotal")}</dt>
                  <dd className="font-semibold">{fmtMoney(totals.subtotalToman)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--sr-fg-muted)]">{tCheckout("review.shipping")}</dt>
                  <dd className="font-semibold">{fmtMoney(totals.shippingToman)}</dd>
                </div>
                <div className="flex justify-between border-t border-white/[0.06] pt-2">
                  <dt className="font-semibold">{tCheckout("review.total")}</dt>
                  <dd className="text-xl font-bold text-[var(--sr-gold-400)]">
                    {fmtMoney(totals.totalToman)}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 text-xs text-[var(--sr-fg-muted)]">
                  <dt>{tCheckout("review.estimated")}</dt>
                  <dd>
                    {fmtDays(totals.etaMinDays)}–{fmtDays(totals.etaMaxDays)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                disabled={!valid}
                onClick={() => {
                  setPlaced(true);
                  clear();
                }}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[var(--sr-radius)] bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] font-semibold text-[var(--sr-navy-950)] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
              >
                {tCheckout("actions.proceedToPayment")}
              </button>

              <Link
                href={`/${locale}/cart`}
                className="mt-3 inline-block text-center text-xs text-[var(--sr-fg-muted)] hover:text-[var(--sr-fg)]"
              >
                ← {tCheckout("actions.backToCart")}
              </Link>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
