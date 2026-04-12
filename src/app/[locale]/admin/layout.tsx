"use client";

import { Header } from "@/components/layout/header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
