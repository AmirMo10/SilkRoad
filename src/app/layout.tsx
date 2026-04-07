import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "راه ابریشم | SilkRoad — بازار عمده‌فروشی چین به ایران",
  description:
    "واردات عمده از چین به ایران با قیمت‌های مستقیم تولیدکننده. سه روش ارسال: اکسپرس، عادی، اقتصادی. پرداخت مرحله‌ای.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans">{children}</body>
    </html>
  );
}
