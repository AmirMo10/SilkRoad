import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "sr-glass rounded-[var(--sr-radius-lg)] p-6 transition-all duration-300 hover:border-[var(--sr-gold-500)]/40 hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}
