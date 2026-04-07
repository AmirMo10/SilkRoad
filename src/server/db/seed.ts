import "dotenv/config";
import { db } from "./index";
import { categories, products, shippingRates } from "./schema";

async function seed() {
  console.log("🌱 Seeding SilkRoad database...");

  // Categories
  const [electronics] = await db
    .insert(categories)
    .values({
      slug: "electronics",
      nameFa: "لوازم الکترونیکی",
      nameEn: "Electronics",
    })
    .returning();

  const [accessories] = await db
    .insert(categories)
    .values({
      slug: "accessories",
      nameFa: "لوازم جانبی",
      nameEn: "Accessories",
    })
    .returning();

  // Products (12 realistic Chinese-import wholesale items)
  await db.insert(products).values([
    {
      slug: "wireless-headphones-v2",
      nameFa: "هدفون بی‌سیم نسل جدید",
      nameEn: "Wireless Headphones v2",
      descriptionFa: "هدفون بی‌سیم با نویز کنسلینگ فعال، باتری ۳۰ ساعت",
      descriptionEn: "Active noise-cancelling wireless headphones, 30h battery",
      categoryId: electronics.id,
      wholesalePriceRial: 1_850_000n,
      moq: 1000,
      quantityStep: 100,
      weightKg: "0.250",
      volumeCbm: "0.0030",
      images: [],
    },
    {
      slug: "smart-sport-watch",
      nameFa: "ساعت هوشمند ورزشی",
      nameEn: "Smart Sport Watch",
      descriptionFa: "ساعت هوشمند با حسگر ضربان قلب و GPS",
      descriptionEn: "Smartwatch with heart-rate sensor and GPS",
      categoryId: electronics.id,
      wholesalePriceRial: 4_200_000n,
      moq: 500,
      quantityStep: 50,
      weightKg: "0.080",
      volumeCbm: "0.0008",
      images: [],
    },
    {
      slug: "powerbank-20000",
      nameFa: "پاوربانک ۲۰۰۰۰ میلی‌آمپر",
      nameEn: "20000 mAh Power Bank",
      descriptionFa: "پاوربانک پرظرفیت با شارژ سریع و دو خروجی USB-C",
      descriptionEn: "High-capacity power bank with fast charging and dual USB-C",
      categoryId: electronics.id,
      wholesalePriceRial: 950_000n,
      moq: 2000,
      quantityStep: 100,
      weightKg: "0.450",
      volumeCbm: "0.0015",
      images: [],
    },
    {
      slug: "wifi-security-camera",
      nameFa: "دوربین مداربسته WiFi",
      nameEn: "WiFi Security Camera",
      descriptionFa: "دوربین مداربسته بی‌سیم با وضوح 4K و دید در شب",
      descriptionEn: "Wireless 4K security camera with night vision",
      categoryId: electronics.id,
      wholesalePriceRial: 6_800_000n,
      moq: 200,
      quantityStep: 20,
      weightKg: "0.350",
      volumeCbm: "0.0040",
      images: [],
    },
    {
      slug: "phone-case-pro",
      nameFa: "قاب گوشی پرو",
      nameEn: "Phone Case Pro",
      descriptionFa: "قاب گوشی ضدضربه با محافظ لنز",
      descriptionEn: "Shockproof phone case with lens protection",
      categoryId: accessories.id,
      wholesalePriceRial: 85_000n,
      moq: 5000,
      quantityStep: 500,
      weightKg: "0.045",
      volumeCbm: "0.0002",
      images: [],
    },
    {
      slug: "led-strip-rgb-5m",
      nameFa: "نوار LED رنگی ۵ متری",
      nameEn: "RGB LED Strip 5m",
      descriptionFa: "نوار LED هوشمند با کنترل از طریق اپلیکیشن",
      descriptionEn: "Smart RGB LED strip with app control",
      categoryId: electronics.id,
      wholesalePriceRial: 320_000n,
      moq: 1000,
      quantityStep: 100,
      weightKg: "0.150",
      volumeCbm: "0.0010",
      images: [],
    },
  ]);

  // Sample shipping rates
  const tiers = [
    { tier: "turbo" as const, rate: 850_000n, base: 5_000_000n, etaMin: 7, etaMax: 15 },
    { tier: "normal" as const, rate: 380_000n, base: 2_500_000n, etaMin: 20, etaMax: 35 },
    { tier: "economy" as const, rate: 150_000n, base: 1_000_000n, etaMin: 45, etaMax: 70 },
  ];
  for (const t of tiers) {
    await db.insert(shippingRates).values({
      tier: t.tier,
      categoryId: null,
      weightMinKg: "0",
      weightMaxKg: "10000",
      ratePerKgRial: t.rate,
      baseCostRial: t.base,
      etaMinDays: t.etaMin,
      etaMaxDays: t.etaMax,
    });
  }

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
