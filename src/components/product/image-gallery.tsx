"use client";

import { useState, useCallback } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  icon: IconName;
  alt: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  badgeText?: string;
}

export function ImageGallery({ images, badgeText }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const switchTo = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return;
      setFading(true);
      setTimeout(() => {
        setActiveIdx(idx);
        setFading(false);
      }, 200);
    },
    [activeIdx],
  );

  const current = images[activeIdx];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-[var(--sr-radius-lg)] border border-[var(--sr-glass-border)] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),transparent_70%),var(--sr-surface)]">
        {badgeText && (
          <span className="absolute start-4 top-4 z-10 rounded-full border border-[var(--sr-gold-400)]/30 bg-[var(--sr-gold-400)]/15 px-3.5 py-1 text-[0.7rem] font-bold text-[var(--sr-gold-300)] backdrop-blur-sm">
            {badgeText}
          </span>
        )}
        <div className="grid h-full w-full place-items-center text-[var(--sr-gold-300)]">
          <Icon
            name={current.icon}
            size={220}
            strokeWidth={1}
            className={cn("transition-opacity duration-300", fading && "opacity-0")}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => switchTo(i)}
            aria-label={img.alt}
            className={cn(
              "grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[var(--sr-radius)] border-2 transition-all",
              i === activeIdx
                ? "border-[var(--sr-gold-400)] bg-[var(--sr-gold-400)]/[0.06] text-[var(--sr-gold-300)]"
                : "border-transparent bg-[var(--sr-surface)] text-[var(--sr-fg-muted)] hover:border-[var(--sr-gold-400)]/30 hover:text-[var(--sr-gold-300)]",
            )}
          >
            <Icon name={img.icon} size={32} strokeWidth={1.3} />
          </button>
        ))}
      </div>
    </div>
  );
}
