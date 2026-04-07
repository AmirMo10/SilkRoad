import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatToman, formatMoq } from "@/lib/formatters";

const FEATURED = [
  { key: "headphones", price: 185_000, moq: 1000, img: "🎧" },
  { key: "watch", price: 420_000, moq: 500, img: "⌚" },
  { key: "powerbank", price: 95_000, moq: 2000, img: "🔋" },
  { key: "camera", price: 680_000, moq: 200, img: "📷" },
] as const;

const TIERS = ["turbo", "normal", "economy"] as const;
const TIER_ICONS: Record<(typeof TIERS)[number], string> = {
  turbo: "⚡",
  normal: "📦",
  economy: "🐢",
};

export default async function HomePage() {
  const tHome = await getTranslations("home");
  const tShipping = await getTranslations("shipping");
  const tProducts = await getTranslations("products");
  const tCommon = await getTranslations("common");

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 sr-pattern opacity-50" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 text-center">
            <Badge className="mb-6">{tHome("hero.badge")}</Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-l from-[var(--sr-gold-300)] via-[var(--sr-gold-400)] to-[var(--sr-gold-500)] bg-clip-text text-transparent">
                {tHome("hero.title")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--sr-fg-muted)] mb-4 max-w-2xl mx-auto">
              {tHome("hero.subtitle")}
            </p>
            <p className="text-base text-[var(--sr-fg-muted)]/80 mb-10 max-w-xl mx-auto">
              {tHome("hero.description")}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg">{tCommon("actions.viewProducts")}</Button>
              <Button size="lg" variant="secondary">
                {tCommon("actions.learnMore")}
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold mb-2 text-center">{tHome("shippingSection.title")}</h2>
          <p className="text-[var(--sr-fg-muted)] text-center mb-12">
            {tHome("shippingSection.subtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <Card key={tier} className="text-center">
                <div className="text-5xl mb-4">{TIER_ICONS[tier]}</div>
                <h3 className="text-xl font-bold text-[var(--sr-gold-400)] mb-2">
                  {tShipping(`tier.${tier}.name`)}
                </h3>
                <p className="text-sm text-[var(--sr-fg-muted)] mb-3">
                  {tShipping(`tier.${tier}.description`)}
                </p>
                <div className="text-sm font-semibold">{tShipping(`tier.${tier}.eta`)}</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold mb-2 text-center">{tHome("featuredSection.title")}</h2>
          <p className="text-[var(--sr-fg-muted)] text-center mb-12">
            {tHome("featuredSection.subtitle")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED.map((p) => (
              <Card key={p.key}>
                <div className="aspect-square rounded-[var(--sr-radius)] bg-[var(--sr-navy-800)] flex items-center justify-center text-7xl mb-4">
                  {p.img}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {tProducts(`samples.${p.key}`)}
                </h3>
                <Badge className="mb-3">{formatMoq(p.moq)}</Badge>
                <div className="text-lg font-bold text-[var(--sr-gold-400)]">
                  {formatToman(p.price)}
                </div>
                <div className="text-xs text-[var(--sr-fg-muted)] mt-1">
                  {tProducts("card.perUnit")}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <Card className="text-center">
            <Badge className="mb-4">{tHome("splitPayment.badge")}</Badge>
            <h2 className="text-3xl font-bold mb-4">{tHome("splitPayment.title")}</h2>
            <p className="text-[var(--sr-fg-muted)] mb-6 max-w-2xl mx-auto">
              {tHome("splitPayment.description")}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="sr-glass rounded-[var(--sr-radius)] p-4">
                <div className="text-2xl font-bold text-[var(--sr-gold-400)]">۵۰٪</div>
                <div className="text-sm text-[var(--sr-fg-muted)]">
                  {tHome("splitPayment.phase1Label")}
                </div>
              </div>
              <div className="sr-glass rounded-[var(--sr-radius)] p-4">
                <div className="text-2xl font-bold text-[var(--sr-gold-400)]">۵۰٪</div>
                <div className="text-sm text-[var(--sr-fg-muted)]">
                  {tHome("splitPayment.phase2Label")}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
