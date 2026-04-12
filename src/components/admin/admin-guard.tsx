"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/use-auth";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--sr-gold-400)] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace(`/${locale}/login`);
    return null;
  }

  if (user.role !== "company_admin" && user.role !== "platform_admin") {
    router.replace(`/${locale}`);
    return null;
  }

  return <>{children}</>;
}
