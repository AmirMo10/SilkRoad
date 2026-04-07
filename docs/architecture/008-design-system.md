# ADR 008 — SilkRoad Design System

**Author:** DARIA
**Status:** Accepted

## Brand essence
SilkRoad evokes the **ancient trade route** — heritage meets futuristic minimalism. Premium, trustworthy, sophisticated, distinctly Iranian without being kitschy. Every screen should feel **crafted, not templated**.

## Color tokens

| Token | Hex | Usage |
|---|---|---|
| `--sr-navy-950` | #070b1c | Background base |
| `--sr-navy-900` | #0b1230 | Surface |
| `--sr-navy-800` | #131c4a | Elevated surface |
| `--sr-navy-700` | #1d2a6b | Borders, dividers |
| `--sr-gold-500` | #d4af37 | Primary accent (CTAs, highlights) |
| `--sr-gold-400` | #e6c25a | Hover state |
| `--sr-gold-300` | #f0d77f | Highlights, subtle |
| `--sr-burgundy-600` | #7a2334 | Secondary accent (alerts, error states with weight) |
| `--sr-sand-100` | #f5f1e8 | Foreground text |
| `--sr-sand-200` | #ebe3d0 | Muted foreground |
| `--sr-sand-300` | #d9cba8 | Subtle text |

Contrast: gold-500 on navy-950 = 7.4:1 (AAA). Sand-100 on navy-950 = 16.5:1.

## Typography
- **Persian:** Vazirmatn (variable, weights 100–900). Loaded via `next/font/google` with `arabic` + `latin` subsets.
- **Latin display (future):** Geist or Manrope (NOT Inter — too generic).
- **Type scale:** 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72 px.
- Headings always `font-weight: 700` or `800`.
- Body `font-weight: 400`, line-height 1.7 for Persian.

## Spacing scale
Tailwind defaults (4px increments). Use `gap-*` instead of margins where possible. RTL-aware: `space-x-reverse` or logical properties.

## Elevation
- `sr-glass`: `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px);`
- Hover lift: `translateY(-4px)` + border becomes gold-500/40.
- Shadow: `0 8px 24px -8px rgba(212,175,55,0.6)` for primary CTAs.

## Radius
- Default: `0.75rem`
- Large: `1.25rem` (cards)
- Pill: `9999px` (badges)

## Motion
- **Library:** Framer Motion.
- **Easing:** `[0.22, 1, 0.36, 1]` (custom ease-out-back-ish).
- **Durations:** 150ms (micro), 300ms (component), 500ms (page).
- **Page transitions:** crossfade + slight Y translate.
- **Hover micro:** scale 1.02 + brightness 1.1.
- **Loading:** silk-ribbon shimmer (custom keyframes).

## Component philosophy
- No default shadcn/ui look. Every primitive customized to brand.
- Glassmorphism on cards.
- Gold gradient on primary buttons (`linear-gradient(180deg, gold-400, gold-500)`).
- All decorative elements respect RTL (icons mirrored, gradients direction-aware).
- Asymmetric grids welcome — avoid perfectly centered everything.

## Persian-inspired motifs
- Subtle dot-pattern background overlay (`.sr-pattern`).
- Geometric border accents on hero sections.
- No overt rugs/arabesques (cliché).

## RTL rules
- Always test in RTL first; LTR is the secondary check.
- Use logical CSS: `padding-inline-start` not `padding-left`.
- Mirror only directional icons (arrows, chevrons), never logos.
- Text-align defaults to `start`.

## Accessibility floor
- WCAG 2.2 AA across all themes.
- Focus ring: `2px gold-500 + 2px navy-950 offset`.
- Touch targets ≥ 44×44 px.
- Color is never the only signal — pair with icon/text.
