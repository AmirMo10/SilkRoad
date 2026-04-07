import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "@/styles/globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "راه ابریشم | SilkRoad — بازار عمده‌فروشی چین به ایران",
  description:
    "واردات عمده از چین به ایران با قیمت‌های مستقیم تولیدکننده. سه روش ارسال: اکسپرس، عادی، اقتصادی. پرداخت مرحله‌ای.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={vazirmatn.className}>{children}</body>
    </html>
  );
}
