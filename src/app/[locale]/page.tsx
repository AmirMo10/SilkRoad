import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { getServerTrpc } from "@/server/api/server";

const TIERS = ["turbo", "normal", "economy"] as const;
const TIER_ICONS: Record<(typeof TIERS)[number], string> = {
  turbo: "⚡",
  normal: "📦",
  economy: "🐢",
};

export default async function HomePage() {
  const tHome = await getTranslations("home");
  const tShipping = await getTranslations("shipping");
  const tCommon = await getTranslations("common");

  const trpc = await getServerTrpc();
  const featuredProducts = await trpc.products.featured({ limit: 4 });

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
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
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
