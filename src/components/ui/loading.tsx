"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <Icon
      name="loader"
      size={size}
      strokeWidth={2}
      className={cn("animate-spin text-[var(--sr-gold-400)]", className)}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--sr-radius)] bg-white/[0.06]",
        className,
      )}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="sr-glass rounded-[var(--sr-radius-lg)] p-5">
      <Skeleton className="mb-3 h-11 w-11" />
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="h-7 w-32" />
    </div>
  );
}
