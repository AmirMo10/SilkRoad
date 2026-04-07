---
name: silkroad-builder
description: "Build and develop the SilkRoad (راه ابریشم) wholesale marketplace — a China-to-Iran B2B trading platform with Next.js 15, TypeScript, Tailwind CSS v4, and a custom premium design system. Use this skill whenever the user mentions SilkRoad, راه ابریشم, the wholesale marketplace, China-to-Iran trade platform, or any work related to this project including: split payment system (Phase 1 upfront / Phase 2 on arrival), minimum order quantities (MOQ), three shipping tiers (Turbo/Normal/Economy), wholesale pricing in Toman, RTL/Farsi layout, Iranian payment gateways (ZarinPal, IDPay, Pay.ir), or any component, page, API, schema, test, or deployment task for this platform. Also trigger when the user asks about the project architecture, agent team coordination, design system, checkout flow, order state machine, or any phase of the build plan (Phase 0–8). Even if the user just says 'continue building' or 'next phase' or references any agent name (AMIR, DARIA, REZA, KAVEH, SARA, MEHDI, LEILA, PARISA, BEHNAM, OMID, NIMA, YASMIN, ARASH, FARHAD), use this skill."
---

# SilkRoad (راه ابریشم) — Project Builder Skill

## Overview

SilkRoad is a production-grade wholesale marketplace for a single trading company importing goods from China and selling them at wholesale scale in Iran. This skill contains all the conventions, architecture decisions, business logic rules, and implementation patterns needed to build every part of the platform.

**Keywords**: silkroad, راه ابریشم, wholesale, marketplace, china, iran, B2B, MOQ, split payment, shipping tiers, toman, RTL, farsi, next.js, typescript

## Quick Reference — Business Rules

These are the non-negotiable business rules. Every component, API, and database query must respect them.

### 1. Single-Vendor Wholesale Model
- One trading company, one storefront. NOT multi-vendor.
- All products are sourced from China and sold to Iranian buyers at wholesale scale.
- Prices are in Toman (تومان). Store internally as Rial, divide by 10 for display.

### 2. Minimum Order Quantity (MOQ)
- Every product has an MOQ (integer, minimum 1). Typical range: 100–5,000 units.
- Cart MUST reject quantities below MOQ. Server MUST also reject — never trust client-only validation.
- Display MOQ badge on every product card and detail page.
- Quantity input starts at MOQ, increments by configurable step (e.g., 100 or 500).
- Optional bulk pricing tiers: discounts above MOQ (e.g., 5,000 units = 5% off).
- Error message (Persian): "حداقل تعداد سفارش برای این محصول ۱,۰۰۰ عدد است"

### 3. Split Payment System
- **Phase 1 — Upfront (پیش‌پرداخت):** 40%–50% of total, paid at checkout. Configurable per product/category. Default: 50%.
- **Phase 2 — On Arrival (پرداخت هنگام تحویل):** Remaining 50%–60%, paid when goods arrive in Iran.
- Order state machine:
  ```
  awaiting_phase1 → phase1_paid → processing → shipped_from_china → in_transit → arrived_in_iran → awaiting_phase2 → phase2_paid → delivering → completed
  ```
- Phase 2 payment reminder: system sends SMS + in-app notification when status hits `arrived_in_iran`.
- Grace period: 72 hours for Phase 2 payment after arrival notification.
- Phase 2 payment links must be time-limited and cryptographically signed.
- Display both amounts clearly: "پیش‌پرداخت: ۵۰,۰۰۰,۰۰۰ تومان" / "باقی‌مانده: ۵۰,۰۰۰,۰۰۰ تومان"

### 4. Three Shipping Tiers (China → Iran)
- **🚀 Turbo (فوری):** Air freight, 7–15 days, highest cost.
- **📦 Normal (عادی):** Combined/expedited sea, 20–35 days, moderate cost.
- **🐢 Economy (اقتصادی):** Full sea freight, 45–75 days, lowest cost.
- Buyer selects tier at checkout. All 3 shown side-by-side with price + ETA.
- Shipping cost calculated from weight (kg), volume (CBM), and product category.
- Shipping cost is added on top of product price.

## Tech Stack

| Layer            | Technology                                                      |
| ---------------- | --------------------------------------------------------------- |
| Framework        | Next.js 15 (App Router, Server Components, Server Actions)      |
| Language         | TypeScript 5.x (strict mode)                                    |
| Styling          | Tailwind CSS v4 + custom design tokens + CSS custom properties  |
| UI Components    | shadcn/ui (customized for SilkRoad brand) + Radix UI primitives |
| Animation        | Framer Motion                                                   |
| State (client)   | Zustand (minimal — prefer server state)                         |
| Server State     | TanStack Query v5 + tRPC                                        |
| Forms            | React Hook Form + Zod validation                                |
| ORM              | Drizzle ORM                                                     |
| Database         | PostgreSQL 16                                                   |
| Cache            | Redis (Upstash or self-hosted)                                  |
| Queue            | BullMQ (Redis-backed)                                           |
| Auth             | Custom JWT + refresh tokens + OTP (no US-dependent providers)   |
| i18n             | next-intl                                                       |
| Search           | PostgreSQL full-text search (+ Meilisearch later)               |
| Storage          | S3-compatible (ArvanCloud Object Storage or MinIO)              |
| SMS              | Kavenegar or Ghasedak                                           |
| Payments         | ZarinPal, IDPay, Pay.ir (unified abstraction, split support)    |
| Shipping         | China-Iran freight forwarders + Tipax, Post Pishtaz, Chapar     |
| Maps             | Neshan Maps API                                                 |
| Testing          | Vitest + Playwright + axe-core                                  |
| CI/CD            | GitHub Actions                                                  |
| Hosting          | ArvanCloud / Liara.ir / Hetzner EU (hybrid)                     |
| CDN              | ArvanCloud CDN                                                  |

## Design System — SilkRoad Brand

The design must be ultra-modern, premium, and unique — NOT a generic marketplace template. Brand identity is inspired by the ancient Silk Road connecting China to Persia.

### Visual Direction
- **Palette:** Deep navy (#0A1628), warm gold (#C4953A), burgundy (#7A2334), cream (#F5F0E8), with silk-white surfaces and subtle warm undertones
- **Typography:** Vazirmatn (variable weight) for Persian, paired with a distinctive Latin display font (not Inter/Roboto). Body in clean geometric sans.
- **Textures:** Subtle silk-thread patterns, woven fabric motifs as background details. Glassmorphism on cards with soft frosted-glass overlays.
- **Motion:** Cinematic page transitions, silk-ribbon loading animations, parallax scrolling on hero sections, spring-physics micro-interactions via Framer Motion.
- **Iconography:** Custom line icons with rounded endpoints, dual-tone (gold/navy). Silk Road motifs: camel caravans, trade routes, Chinese/Persian geometric patterns as decorative borders.
- **Layout:** Generous whitespace, asymmetric grids, oversized product imagery. RTL-first — every layout decision starts from RTL.

### Component Philosophy
- Every component must feel premium and intentional. No default shadcn/ui styling — everything customized.
- Product cards: large imagery, gold MOQ badge, shimmer loading skeleton, hover-reveal price calculator.
- Shipping tier selector: side-by-side cards with iconography (airplane/ship/container), animated ETA timeline.
- Split payment breakdown: visual progress bar showing Phase 1 (filled) → Phase 2 (pending), with Toman amounts.
- Order timeline: vertical stepper with animated status icons, bilingual labels.

## Folder Structure

```
silkroad/
├── CLAUDE.md
├── Enhanced_Claude_Coworkers.md
├── SKILL.md                           # This file
├── src/
│   ├── app/[locale]/
│   │   ├── page.tsx                   # Landing — hero, featured products, "How It Works"
│   │   ├── (auth)/                    # login, register, verify-otp
│   │   ├── (buyer)/
│   │   │   ├── products/              # Catalog with MOQ badges, filters
│   │   │   ├── product/[slug]/        # Detail: MOQ, tiers, calculator
│   │   │   ├── cart/                  # MOQ-enforced cart
│   │   │   ├── checkout/             # Multi-step: tier → split payment → Phase 1 pay
│   │   │   └── orders/               # Tracking with payment phase status
│   │   ├── (company)/                # Single-vendor dashboard
│   │   │   ├── dashboard/            # Revenue, orders, shipments
│   │   │   ├── products/             # CRUD with MOQ, pricing, images
│   │   │   ├── orders/               # Split payment phase tracking
│   │   │   └── shipments/            # Tier-based tracking
│   │   ├── (admin)/                  # Platform admin
│   │   │   ├── dashboard/            # GMV, payment phases, analytics
│   │   │   ├── payments/             # Phase 1 & 2 ledger
│   │   │   ├── shipping/             # Tier config, rate tables
│   │   │   └── settings/             # Split %, MOQ defaults, rates
│   │   └── (static)/                 # about, how-it-works, contact, terms
│   ├── components/
│   │   ├── ui/                       # Customized shadcn/ui
│   │   ├── product/                  # ProductCard, MOQBadge, BulkCalculator
│   │   ├── checkout/                 # ShippingTierPicker, SplitPaymentForm
│   │   ├── shipping/                 # TierSelector, ETADisplay, CostCalc
│   │   ├── payment/                  # SplitPaymentUI, PhaseTracker
│   │   └── order/                    # OrderTimeline, PaymentStatus
│   ├── server/
│   │   ├── db/schema/                # products, orders, payments, shipping
│   │   ├── services/                 # product, order, payment, shipping services
│   │   └── integrations/             # payment gateways, SMS, freight, maps
│   ├── lib/
│   │   ├── shipping-calculator.ts    # Tier-based cost engine
│   │   ├── payment-calculator.ts     # Split amount computation
│   │   └── persian-utils.ts          # Numbers, phone, currency formatting
│   ├── hooks/                        # use-cart, use-shipping-tier, use-split-payment
│   └── i18n/messages/fa/             # Persian translations (all namespaces)
└── tests/e2e/                        # MOQ, split payment, shipping tier E2E tests
```

## Phase-Based Build Plan

Always work one phase at a time. Each phase ends with a QA checkpoint.

### Phase 0 — Planning & Design
- Full project plan, tech stack confirmation
- SilkRoad design system: tokens, palette, typography, component specs
- Database ERD with MOQ, split payment, and shipping tier tables
- Split payment state machine design (ADR)
- Iran market research & compliance briefing
- Security architecture (split payment fraud prevention)
- Infrastructure plan

### Phase 1 — Scaffolding & Auth
- Next.js 15 project setup with TypeScript strict mode
- Tailwind CSS v4 + SilkRoad design tokens
- Database schema: users, products (with moq, wholesale_price_rial), orders (with payment_phase, shipping_tier), payments (split tracking), shipping_rates
- Auth: JWT + OTP via Kavenegar, RBAC (buyer, company_admin, platform_admin)
- i18n setup with next-intl, RTL layout, Persian fonts

### Phase 2 — Product Catalog & Company Dashboard
- Product listing with MOQ badges, wholesale prices in Toman
- Product detail page: MOQ display, bulk price calculator, shipping tier preview
- Search and filters (category, price range, MOQ range)
- Company dashboard: product CRUD (pricing, MOQ, images, categories)

### Phase 3 — Cart, Checkout & Payment
- Cart with MOQ enforcement (client + server validation)
- Multi-step checkout: order review → shipping tier selection → split payment breakdown → Phase 1 payment
- Payment gateway integration (ZarinPal, IDPay) with partial/split payment support
- Order creation with split payment tracking

### Phase 4 — Order Management & Shipping
- Order tracking dashboard with payment phase status
- Shipment tracking per tier (Turbo/Normal/Economy)
- Phase 2 payment collection flow (triggered on arrival)
- Notification engine: SMS + in-app for order updates, arrival alerts, Phase 2 reminders
- 72-hour grace period enforcement

### Phase 5 — Admin Panel & Analytics
- Admin dashboard: GMV, Phase 1 collected, Phase 2 pending, orders by tier
- Payment ledger: Phase 1 & Phase 2 tracking across all orders
- Shipping rate configuration (per tier, per weight bracket, per category)
- Split percentage configuration (per product/category)
- User management, financial reports

### Phase 6 — SEO, Performance & PWA
- Technical SEO: metadata, sitemaps, structured data (Product with MOQ, Offer)
- Performance optimization: bundle splitting, image pipeline (AVIF/WebP), font subsetting
- PWA configuration: service worker, offline cart, install prompt
- "How It Works" page: visual guide for wholesale ordering process

### Phase 7 — Security & Testing
- OWASP Top 10 mitigations
- Split payment security: signed Phase 2 links, replay prevention, server-side amount validation
- E2E tests: MOQ enforcement, split payment flow, shipping tier selection, Phase 2 collection
- Visual regression tests for RTL, Jalali dates, Toman formatting
- Load testing with k6

### Phase 8 — Launch Preparation
- Production deployment (ArvanCloud / Hetzner EU hybrid)
- Monitoring: Grafana + Prometheus, payment phase alerts
- Backup & disaster recovery
- Documentation: API docs, runbooks, onboarding guide
- Launch checklist sign-off

## Agent Team

14 specialized agents coordinate the build. Reference them by name when needed:

| # | Agent | Role |
|---|-------|------|
| 1 | 🧠 AMIR | Product Manager & Tech Lead — owns vision, specs, state machine design |
| 2 | 🎨 DARIA | Creative Director — SilkRoad brand, design system, component specs |
| 3 | 💻 REZA | Senior Frontend — implements UI with RTL, MOQ, split payment, tier selector |
| 4 | ⚙️ KAVEH | Senior Backend — APIs, split payment state machine, payment gateways |
| 5 | 🗄️ SARA | Database & Architecture — schema, indexing, caching, scaling |
| 6 | 🧪 MEHDI | QA & Testing — E2E, MOQ tests, split payment tests, RTL tests |
| 7 | 📈 LEILA | SEO & Growth — technical SEO, B2B wholesale marketing |
| 8 | 🔍 PARISA | Iran Market Specialist — compliance, logistics, payment research |
| 9 | 🔒 BEHNAM | Security — OWASP, split payment fraud prevention, RBAC |
| 10 | 🚀 OMID | DevOps & SRE — CI/CD, Docker, monitoring, Iran-friendly hosting |
| 11 | 📊 NIMA | Analytics — funnel tracking, admin dashboards, A/B testing |
| 12 | 💬 YASMIN | Content & i18n — Persian translations, wholesale terminology, email templates |
| 13 | 📱 ARASH | Mobile & Performance — PWA, bundle optimization, network resilience |
| 14 | 🤝 FARHAD | Integration Architect — payment abstraction, shipping APIs, webhooks |

## Code Conventions

### Naming
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Components: PascalCase (`ProductCard.tsx`, `MOQBadge.tsx`, `ShippingTierPicker.tsx`)
- Hooks: `use-` prefix (`use-cart.ts`, `use-split-payment.ts`)
- Database tables: snake_case plural (`payment_phases`, `shipping_rates`)
- i18n keys: dot-notation (`checkout.splitPayment.phase1Label`)

### TypeScript
- `strict: true` — no overrides, no `any`, use `unknown` + type guards
- Zod schemas as single source of truth for validation
- Enums for shipping tiers (`TURBO | NORMAL | ECONOMY`) and payment phases (`PHASE_1 | PHASE_2`)

### RTL & Farsi
- `dir="rtl"` on `<html>` for Persian locale
- Logical CSS properties only (`margin-inline-start` not `margin-left`)
- Persian numerals for all user-facing numbers (۰۱۲۳۴۵۶۷۸۹)
- Currency: `۱,۲۳۴,۵۶۷ تومان` (stored as Rial internally, ÷10)
- Jalali calendar for all dates: `۱۴۰۵/۰۱/۱۷`
- Mirror directional icons in RTL

### Security
- Server-side validation for MOQ, split amounts, shipping tier
- Phase 2 payment links: time-limited, cryptographically signed, no replay
- CSRF tokens for all state-changing operations
- Rate-limit auth endpoints
- Never expose internal errors to client

## Key Database Tables

### products
```
id, slug, name_fa, name_en, description_fa, category_id,
wholesale_price_rial, moq, quantity_step, weight_kg, volume_cbm,
origin_country (default: 'CN'), images[], is_active,
split_payment_ratio (nullable — falls back to category or global default),
created_at, updated_at
```

### orders
```
id, user_id, status (enum: order state machine states),
shipping_tier (enum: turbo|normal|economy),
subtotal_rial, shipping_cost_rial, total_rial,
phase1_amount_rial, phase2_amount_rial, split_ratio,
phase1_paid_at, phase2_paid_at, phase2_due_at,
estimated_delivery_at, actual_delivery_at,
tracking_number, created_at, updated_at
```

### payments
```
id, order_id, phase (enum: phase_1|phase_2),
amount_rial, gateway (enum: zarinpal|idpay|payir),
gateway_ref, status (enum: pending|success|failed|refunded),
paid_at, created_at
```

### shipping_rates
```
id, tier (enum: turbo|normal|economy),
category_id (nullable), weight_min_kg, weight_max_kg,
rate_per_kg_rial, base_cost_rial,
estimated_days_min, estimated_days_max,
is_active, created_at, updated_at
```

## Quality Gates

Before any phase is marked complete, verify ALL of these:

- TypeScript compiles with zero errors (`tsc --noEmit`)
- ESLint passes with zero warnings
- All unit tests pass, all E2E tests pass for affected flows
- RTL rendering verified visually
- Persian text, numbers, and currency display correctly
- MOQ enforcement tested (cart + server-side)
- Split payment amounts calculated correctly (Phase 1 + Phase 2 = total)
- Shipping tier pricing and ETAs display correctly for all 3 tiers
- Phase 2 payment reminder flow tested
- No security vulnerabilities in `npm audit`
- Performance budget not exceeded (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- All new strings added to i18n files
- API endpoints have Zod input validation
- Error boundaries cover new components
- Accessibility: no axe-core violations

## Instructions for Claude

When working on this project:

1. **Always read CLAUDE.md first** — it has the complete folder structure and all conventions.
2. **Always read Enhanced_Claude_Coworkers.md** — it defines the agent team and phase plan.
3. **Check which phase you're in** — ask the user if unclear. Never skip phases.
4. **Assume the agent role** that matches the current task (e.g., REZA for frontend, KAVEH for backend).
5. **Enforce business rules** — MOQ, split payment, and shipping tiers are non-negotiable in every component.
6. **RTL-first** — every layout, every component, every test starts from RTL.
7. **Persian-first** — all user-facing strings go through i18n. No hard-coded strings.
8. **Test everything** — write tests alongside features, not as an afterthought.
9. **Premium design** — use the SilkRoad brand identity. No generic styling. Every pixel matters.
10. **Sanctions-aware** — no US-dependent services in critical path. Use Iranian alternatives.

## Constraints

- Never skip server-side validation for MOQ or split payment amounts
- Never allow orders below MOQ to reach payment step
- Never hard-code split payment ratios — always pull from config (product → category → global fallback)
- Never use US-sanctioned services for auth, payments, or hosting
- Never use `any` type in TypeScript
- Never deploy without running the full quality gate checklist
- Never store raw payment card data — use tokenized gateways only
