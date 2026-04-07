import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "راه ابریشم | SilkRoad",
  description: "بازار عمده‌فروشی چین به ایران",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
