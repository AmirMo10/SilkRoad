import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/ui/icon";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatToman, formatMoq, toPersianDigits } from "@/lib/formatters";
import { calculateSplit } from "@/lib/payment-calculator";
import { TRPCError } from "@trpc/server";
import { getServerTrpc } from "@/server/api/server";

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const ICON_BY_SLUG: Record<string, IconName> = {
  "wireless-headphones-v2": "headphones",
  "smart-sport-watch": "watch",
  "powerbank-20000": "battery",
  "wifi-security-camera": "camera",
  "phone-case-pro": "box",
  "led-strip-rgb-5m": "bolt",
};

const TIERS: { key: "turbo" | "normal" | "economy"; icon: IconName }[] = [
  { key: "turbo", icon: "bolt" },
  { key: "normal", icon: "package" },
  { key: "economy", icon: "wave" },
];

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const tProducts = await getTranslations("products");
  const tShipping = await getTranslations("shipping");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const trpc = await getServerTrpc();
  let product;
  try {
    product = await trpc.products.bySlug({ slug });
  } catch (err) {
    if (err instanceof TRPCError && err.code === "NOT_FOUND") notFound();
    throw err;
  }

  const name = locale === "fa" ? product.nameFa : product.nameEn;
  const description = locale === "fa" ? product.descriptionFa : product.descriptionEn;
  const categoryName = product.category
    ? locale === "fa"
      ? product.category.nameFa
      : product.category.nameEn
    : null;

  const priceToman = Number(product.wholesalePriceRial) / 10;
  const ratio = product.splitPaymentRatio ? Number(product.splitPaymentRatio) : 0.5;
  // Split payment preview for a single MOQ batch
  const batchTotalRial = product.wholesalePriceRial * BigInt(product.moq);
  const split = calculateSplit(batchTotalRial, ratio);
  const phase1Toman = Number(split.phase1Rial) / 10;
  const phase2Toman = Number(split.phase2Rial) / 10;

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-white/[0.05] py-4 text-sm text-[var(--sr-fg-muted)]"
        >
          <ol className="mx-auto flex max-w-7xl items-center gap-2 px-6">
            <li>
              <Link href="/" className="hover:text-[var(--sr-gold-300)]">
                {tCommon("nav.home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products" className="hover:text-[var(--sr-gold-300)]">
                {tCommon("nav.products")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--sr-fg)]">{name}</li>
          </ol>
        </nav>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Gallery */}
            <div className="sr-glass grid aspect-square place-items-center rounded-[var(--sr-radius-lg)] [background:radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_70%),var(--sr-navy-900)]">
              <Icon
                name={ICON_BY_SLUG[product.slug] ?? "box"}
                size={220}
                strokeWidth={1}
                className="text-[var(--sr-gold-300)]"
              />
            </div>

            {/* Info */}
            <div>
              {categoryName && (
                <div className="mb-3 text-sm text-[var(--sr-fg-muted)]">{categoryName}</div>
              )}
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">{name}</h1>
              <p className="mb-6 text-[var(--sr-fg-muted)]">{description}</p>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge className="text-sm">
                  {locale === "fa"
                    ? formatMoq(product.moq)
                    : `MOQ: ${product.moq.toLocaleString("en-US")} units`}
                </Badge>
                <Badge className="text-sm">
                  <Icon name="globe" size={14} strokeWidth={2} />
                  {tProducts("detail.originCN")}
                </Badge>
              </div>

              <Card className="mb-6">
                <div className="text-sm text-[var(--sr-fg-muted)]">
                  {tProducts("card.perUnit")}
                </div>
                <div className="mt-1 text-4xl font-extrabold text-[var(--sr-gold-400)]">
                  {locale === "fa"
                    ? formatToman(priceToman)
                    : `${priceToman.toLocaleString("en-US")} Toman`}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 text-sm">
                  <div>
                    <div className="text-[var(--sr-fg-muted)]">{tProducts("detail.weight")}</div>
                    <div className="font-semibold">
                      {locale === "fa"
                        ? `${toPersianDigits(product.weightKg)} ${tProducts("detail.kg")}`
                        : `${product.weightKg} kg`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[var(--sr-fg-muted)]">{tProducts("detail.step")}</div>
                    <div className="font-semibold">
                      {locale === "fa"
                        ? toPersianDigits(product.quantityStep.toLocaleString("en-US"))
                        : product.quantityStep.toLocaleString("en-US")}
                    </div>
                  </div>
                </div>
              </Card>

              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                nameFa={product.nameFa}
                nameEn={product.nameEn}
                iconSlug={ICON_BY_SLUG[product.slug] ?? "box"}
                priceToman={priceToman}
                moq={product.moq}
                quantityStep={product.quantityStep}
                weightKg={Number(product.weightKg)}
                volumeCbm={Number(product.volumeCbm)}
                label={tProducts("detail.addToCart")}
                locale={locale}
              />
            </div>
          </div>
        </section>

        {/* Shipping tiers */}
        <section className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="mb-6 text-2xl font-bold">{tProducts("detail.shippingSection")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <Card key={t.key}>
                <div className="mb-4 inline-grid h-14 w-14 place-items-center rounded-[var(--sr-radius)] border border-[var(--sr-gold-500)]/30 bg-[var(--sr-gold-500)]/5 text-[var(--sr-gold-400)]">
                  <Icon name={t.icon} size={28} strokeWidth={1.4} />
                </div>
                <div className="text-lg font-bold text-[var(--sr-gold-400)]">
                  {tShipping(`tier.${t.key}.name`)}
                </div>
                <p className="mt-1 text-sm text-[var(--sr-fg-muted)]">
                  {tShipping(`tier.${t.key}.description`)}
                </p>
                <div className="mt-3 text-sm font-semibold">{tShipping(`tier.${t.key}.eta`)}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Split payment preview */}
        <section className="mx-auto max-w-5xl px-6 py-10">
          <Card className="text-center">
            <Badge className="mb-3">
              <Icon name="shield" size={14} strokeWidth={2} />
              {tHome("splitPayment.badge")}
            </Badge>
            <h2 className="mb-3 text-2xl font-bold">{tProducts("detail.splitPreviewTitle")}</h2>
            <p className="mx-auto mb-6 max-w-2xl text-[var(--sr-fg-muted)]">
              {tProducts("detail.splitPreviewDesc", {
                moq: locale === "fa" ? toPersianDigits(product.moq.toLocaleString("en-US")) : product.moq.toLocaleString("en-US"),
              })}
            </p>
            <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
              <div className="sr-glass rounded-[var(--sr-radius)] p-4">
                <div className="text-xs text-[var(--sr-fg-muted)]">
                  {tHome("splitPayment.phase1Label")}
                </div>
                <div className="mt-1 text-2xl font-bold text-[var(--sr-gold-400)]">
                  {locale === "fa"
                    ? formatToman(phase1Toman)
                    : `${phase1Toman.toLocaleString("en-US")} Toman`}
                </div>
                <div className="mt-1 text-xs text-[var(--sr-fg-muted)]">
                  {locale === "fa"
                    ? toPersianDigits(Math.round(ratio * 100))
                    : Math.round(ratio * 100)}
                  %
                </div>
              </div>
              <div className="sr-glass rounded-[var(--sr-radius)] p-4">
                <div className="text-xs text-[var(--sr-fg-muted)]">
                  {tHome("splitPayment.phase2Label")}
                </div>
                <div className="mt-1 text-2xl font-bold text-[var(--sr-gold-400)]">
                  {locale === "fa"
                    ? formatToman(phase2Toman)
                    : `${phase2Toman.toLocaleString("en-US")} Toman`}
                </div>
                <div className="mt-1 text-xs text-[var(--sr-fg-muted)]">
                  {locale === "fa"
                    ? toPersianDigits(100 - Math.round(ratio * 100))
                    : 100 - Math.round(ratio * 100)}
                  %
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
