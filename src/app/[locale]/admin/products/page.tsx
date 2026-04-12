"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";

export default function AdminProductsPage() {
  const locale = useLocale();
  const t = useTranslations("admin.products");

  const fmt = (n: number) =>
    locale === "fa" ? formatToman(n) : `${n.toLocaleString("en-US")} T`;
  const fmtNum = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toLocaleString("en-US")) : n.toLocaleString("en-US");

  // Placeholder data — tRPC queries will replace this when DB is connected
  const products = [
    { id: "1", nameFa: "هدفون بلوتوثی شیائومی", nameEn: "Xiaomi Bluetooth Headphones", priceToman: 185_000, moq: 1000, step: 100, weightKg: 0.28, category: "الکترونیک", categoryEn: "Electronics", isActive: true },
    { id: "2", nameFa: "ساعت هوشمند T500 Pro", nameEn: "T500 Pro Smartwatch", priceToman: 420_000, moq: 500, step: 50, weightKg: 0.12, category: "ساعت", categoryEn: "Watches", isActive: true },
    { id: "3", nameFa: "کابل شارژ تایپ‌سی ۱ متری", nameEn: "USB-C Charging Cable 1m", priceToman: 18_500, moq: 5000, step: 500, weightKg: 0.04, category: "لوازم جانبی", categoryEn: "Accessories", isActive: true },
    { id: "4", nameFa: "پاوربانک ۲۰۰۰۰ میلی‌آمپر", nameEn: "20000mAh Power Bank", priceToman: 310_000, moq: 500, step: 50, weightKg: 0.45, category: "الکترونیک", categoryEn: "Electronics", isActive: false },
    { id: "5", nameFa: "قاب سیلیکونی آیفون ۱۵", nameEn: "iPhone 15 Silicone Case", priceToman: 45_000, moq: 2000, step: 200, weightKg: 0.03, category: "لوازم جانبی", categoryEn: "Accessories", isActive: true },
    { id: "6", nameFa: "اسپیکر بلوتوثی JBL کپی", nameEn: "JBL Replica Bluetooth Speaker", priceToman: 275_000, moq: 300, step: 50, weightKg: 0.55, category: "الکترونیک", categoryEn: "Electronics", isActive: true },
  ];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-[var(--sr-radius)] bg-gradient-to-br from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] px-4 py-2.5 text-sm font-bold text-[var(--sr-navy-950)] shadow-lg shadow-[var(--sr-gold-500)]/25 transition-transform hover:-translate-y-0.5">
          <Icon name="plus" size={18} strokeWidth={2} />
          {t("addProduct")}
        </button>
      </header>

      <div className="mb-4 text-sm text-[var(--sr-fg-muted)]">
        {locale === "fa"
          ? t("count", { count: products.length })
          : t("count", { count: products.length })}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--sr-glass-border)] text-[var(--sr-fg-muted)]">
                <th className="px-4 py-3 text-start font-medium">{t("name")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("price")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("moq")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("weight")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("category")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("status")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[var(--sr-glass-border)] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-semibold">
                    {locale === "fa" ? product.nameFa : product.nameEn}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--sr-gold-400)]">
                    {fmt(product.priceToman)}
                  </td>
                  <td className="px-4 py-3">{fmtNum(product.moq)}</td>
                  <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                    {fmtNum(product.weightKg)} {locale === "fa" ? "کیلوگرم" : "kg"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="text-xs">
                      {locale === "fa" ? product.category : product.categoryEn}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="inline-flex items-center gap-1.5 text-xs"
                      title={product.isActive ? t("active") : t("inactive")}
                    >
                      <Icon
                        name={product.isActive ? "toggleOn" : "toggleOff"}
                        size={28}
                        strokeWidth={1.5}
                        className={product.isActive ? "text-emerald-400" : "text-[var(--sr-fg-muted)]"}
                      />
                      <span className={product.isActive ? "text-emerald-400" : "text-[var(--sr-fg-muted)]"}>
                        {product.isActive ? t("active") : t("inactive")}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-[var(--sr-radius)] p-2 text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-gold-400)]"
                        title={t("edit")}
                      >
                        <Icon name="edit" size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        className="rounded-[var(--sr-radius)] p-2 text-[var(--sr-fg-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title={t("delete")}
                      >
                        <Icon name="trash" size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
