import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatToman, formatMoq } from "@/lib/formatters";

const SHIPPING_TIERS = [
  {
    icon: "⚡",
    name: "اکسپرس",
    eta: "۷ تا ۱۵ روز",
    desc: "ارسال هوایی، سریع‌ترین گزینه",
  },
  { icon: "📦", name: "عادی", eta: "۲۰ تا ۳۵ روز", desc: "ترکیبی، تعادل قیمت و سرعت" },
  { icon: "🐢", name: "اقتصادی", eta: "۴۵ تا ۷۰ روز", desc: "ارسال دریایی، کم‌هزینه‌ترین" },
];

const FEATURED = [
  { name: "هدفون بی‌سیم نسل جدید", price: 185_000, moq: 1000, img: "🎧" },
  { name: "ساعت هوشمند ورزشی", price: 420_000, moq: 500, img: "⌚" },
  { name: "پاوربانک ۲۰۰۰۰ میلی‌آمپر", price: 95_000, moq: 2000, img: "🔋" },
  { name: "دوربین مداربسته WiFi", price: 680_000, moq: 200, img: "📷" },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 sr-pattern opacity-50" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 text-center">
            <Badge className="mb-6">بازار عمده‌فروشی شماره یک</Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-l from-[var(--sr-gold-300)] via-[var(--sr-gold-400)] to-[var(--sr-gold-500)] bg-clip-text text-transparent">
                راه ابریشم
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--sr-fg-muted)] mb-4 max-w-2xl mx-auto">
              واردات مستقیم عمده از چین به ایران
            </p>
            <p className="text-base text-[var(--sr-fg-muted)]/80 mb-10 max-w-xl mx-auto">
              قیمت‌های تولیدکننده، سه روش ارسال، پرداخت مرحله‌ای امن
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg">مشاهده محصولات</Button>
              <Button size="lg" variant="secondary">
                نحوه خرید
              </Button>
            </div>
          </div>
        </section>

        {/* Shipping tiers */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold mb-2 text-center">روش‌های ارسال</h2>
          <p className="text-[var(--sr-fg-muted)] text-center mb-12">
            انتخاب با شماست — هر سفارش، سه گزینه
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {SHIPPING_TIERS.map((tier) => (
              <Card key={tier.name} className="text-center">
                <div className="text-5xl mb-4">{tier.icon}</div>
                <h3 className="text-xl font-bold text-[var(--sr-gold-400)] mb-2">{tier.name}</h3>
                <p className="text-sm text-[var(--sr-fg-muted)] mb-3">{tier.desc}</p>
                <div className="text-sm font-semibold">{tier.eta}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold mb-2 text-center">محصولات منتخب</h2>
          <p className="text-[var(--sr-fg-muted)] text-center mb-12">
            بهترین فرصت‌های واردات این هفته
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED.map((p) => (
              <Card key={p.name}>
                <div className="aspect-square rounded-[var(--sr-radius)] bg-[var(--sr-navy-800)] flex items-center justify-center text-7xl mb-4">
                  {p.img}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{p.name}</h3>
                <Badge className="mb-3">{formatMoq(p.moq)}</Badge>
                <div className="text-lg font-bold text-[var(--sr-gold-400)]">
                  {formatToman(p.price)}
                </div>
                <div className="text-xs text-[var(--sr-fg-muted)] mt-1">قیمت هر واحد</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Split payment explainer */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <Card className="text-center">
            <Badge className="mb-4">پرداخت امن</Badge>
            <h2 className="text-3xl font-bold mb-4">پرداخت مرحله‌ای</h2>
            <p className="text-[var(--sr-fg-muted)] mb-6 max-w-2xl mx-auto">
              نیمی از مبلغ را هنگام ثبت سفارش پرداخت کنید و مابقی را پس از رسیدن کالا به ایران.
              امنیت کامل، بدون ریسک.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="sr-glass rounded-[var(--sr-radius)] p-4">
                <div className="text-2xl font-bold text-[var(--sr-gold-400)]">۵۰٪</div>
                <div className="text-sm text-[var(--sr-fg-muted)]">هنگام ثبت سفارش</div>
              </div>
              <div className="sr-glass rounded-[var(--sr-radius)] p-4">
                <div className="text-2xl font-bold text-[var(--sr-gold-400)]">۵۰٪</div>
                <div className="text-sm text-[var(--sr-fg-muted)]">هنگام رسیدن کالا</div>
              </div>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
