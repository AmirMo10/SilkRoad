import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 sr-glass border-b border-[var(--sr-glass-border)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[var(--sr-gold-400)]">راه ابریشم</span>
          <span className="text-xs text-[var(--sr-fg-muted)]">SilkRoad</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--sr-fg-muted)]">
          <Link href="/products" className="hover:text-[var(--sr-fg)] transition-colors">
            محصولات
          </Link>
          <Link href="/how-it-works" className="hover:text-[var(--sr-fg)] transition-colors">
            نحوه خرید
          </Link>
          <Link href="/shipping-info" className="hover:text-[var(--sr-fg)] transition-colors">
            ارسال
          </Link>
          <Link href="/about" className="hover:text-[var(--sr-fg)] transition-colors">
            درباره ما
          </Link>
        </nav>
        <Button size="sm">ورود</Button>
      </div>
    </header>
  );
}
