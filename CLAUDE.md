# CLAUDE.md — SilkRoad (راه ابریشم) Project Conventions & Rules

> This file is the single source of truth for all project conventions.
> Every agent on the team MUST follow these rules. No exceptions.

---

## 🏗️ Project Overview

**SilkRoad (راه ابریشم)** is a production-grade wholesale B2B marketplace connecting Chinese suppliers to Iranian buyers at wholesale scale. Built with Next.js 15, TypeScript, and a custom design system. The platform displays products with wholesaler prices in **Toman** and enforces **minimum order quantities** (e.g., 1,000+ units per product). Supports RTL/Farsi natively, integrates with Iranian payment gateways and logistics providers, and follows sanctions-aware architecture principles.

### 🔑 Core Business Model

1. **China-to-Iran Wholesale Import:** The trading company sources products from China and lists them on SilkRoad at wholesale prices (in Toman) with minimum order quantities (MOQ).
2. **Split Payment System:**
   - **Phase 1 (Order Confirmation):** Buyer pays **40–50%** of total order value upfront via Iranian payment gateways to confirm the order.
   - **Phase 2 (Delivery Completion):** Buyer pays the **remaining 50–60%** upon product arrival in Iran before final delivery.
3. **Three Shipping Tiers (China → Iran):**
   - **⚡ Turbo (اکسپرس):** Fastest delivery — air freight, ~7–15 days. Premium pricing.
   - **📦 Normal (عادی):** Standard delivery — mixed transport, ~20–35 days. Balanced pricing.
   - **🐢 Slow (اقتصادی):** Economy delivery — sea freight, ~45–70 days. Lowest cost.
4. **Minimum Order Quantity (MOQ):** Every product has a defined MOQ (e.g., 1,000 units). Orders below MOQ are rejected. The system must clearly display MOQ on product cards and detail pages and validate at cart/checkout.
5. **Single Vendor (Company-Operated):** Unlike a multi-vendor marketplace, SilkRoad is operated by a single trading company. There are no independent sellers — the company manages all product listings, pricing, inventory, and fulfillment. The admin panel serves as the company's operational hub.

### 🎨 Design Identity

The SilkRoad brand must feel **very unique and modern** — not a generic template. Think: premium silk textures, Silk Road heritage meets futuristic minimalism, rich gradients (deep navy, gold accents, warm sand tones), elegant Persian-inspired geometric patterns as subtle UI motifs, glass-morphism effects, bold typography, smooth micro-animations. The website and application should feel like a luxury wholesale portal — trustworthy, sophisticated, and visually memorable. Every page should feel crafted, not templated.

---

## 📁 Folder Structure

```
silkroad/
├── CLAUDE.md                          # This file — project rules
├── Enhanced_Claude_Coworkers.md       # Agent team orchestration prompt
├── README.md                          # Project documentation
├── .env.example                       # Environment variables template
├── .env.local                         # Local env (gitignored)
├── next.config.ts                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind + custom design tokens
├── tsconfig.json                      # TypeScript strict config
├── drizzle.config.ts                  # Drizzle ORM config
├── vitest.config.ts                   # Unit test config
├── playwright.config.ts              # E2E test config
├── docker-compose.yml                # Local dev services (Postgres, Redis)
├── Dockerfile                         # Production container
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Lint → Test → Build → Security scan
│       └── deploy.yml                 # Staging & production deploy
├── docs/
│   ├── architecture/                  # ADRs (Architecture Decision Records)
│   │   ├── 001-tech-stack.md
│   │   ├── 002-database-schema.md
│   │   ├── 003-payment-abstraction.md
│   │   ├── 004-security-architecture.md
│   │   ├── 005-infrastructure-plan.md
│   │   ├── 006-split-payment-flow.md         # Split payment (40-50% + remainder) architecture
│   │   ├── 007-shipping-tiers.md             # Turbo/Normal/Slow shipping tier logic
│   │   └── 008-moq-validation.md             # Minimum Order Quantity enforcement rules
│   ├── api/                           # API documentation
│   ├── design/                        # Design system docs
│   ├── iran-research/                 # Market research & compliance docs
│   └── runbooks/                      # Incident response & operational runbooks
├── public/
│   ├── fonts/                         # Self-hosted Persian + Latin fonts
│   ├── icons/                         # App icons, favicons
│   ├── images/                        # Static images
│   └── locales/                       # (if using public locale files)
├── src/
│   ├── app/                           # Next.js 15 App Router
│   │   ├── [locale]/                  # i18n locale prefix
│   │   │   ├── layout.tsx             # Root layout (RTL, fonts, metadata)
│   │   │   ├── page.tsx               # Home page (hero, featured wholesale products)
│   │   │   ├── (auth)/               # Auth routes group
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── verify-otp/
│   │   │   ├── (buyer)/              # Buyer-facing routes
│   │   │   │   ├── products/          # Browse wholesale catalog (with MOQ display)
│   │   │   │   ├── product/[slug]/    # Product detail (MOQ, shipping tiers, pricing)
│   │   │   │   ├── cart/              # Cart (MOQ validation, shipping tier selection)
│   │   │   │   ├── checkout/          # Checkout (split payment: pay 40-50% upfront)
│   │   │   │   ├── orders/            # Order history & tracking
│   │   │   │   ├── orders/[id]/pay-remaining/  # Pay remaining balance on arrival
│   │   │   │   └── profile/
│   │   │   ├── (admin)/              # Company admin panel routes
│   │   │   │   ├── dashboard/         # Overview: revenue, pending orders, shipments
│   │   │   │   ├── products/          # Manage product listings, MOQ, pricing
│   │   │   │   ├── orders/            # Order management & payment status tracking
│   │   │   │   ├── shipments/         # Track shipments (Turbo/Normal/Slow)
│   │   │   │   ├── payments/          # Split payment ledger, pending balances
│   │   │   │   ├── users/             # Customer management
│   │   │   │   ├── reports/           # Financial & operational reports
│   │   │   │   └── settings/          # Platform settings
│   │   │   └── (static)/             # Static/info pages
│   │   │       ├── about/
│   │   │       ├── contact/
│   │   │       ├── how-it-works/      # Explain wholesale ordering + split payment process
│   │   │       ├── shipping-info/     # Explain Turbo/Normal/Slow tiers
│   │   │       ├── terms/
│   │   │       └── privacy/
│   │   └── api/                       # API routes
│   │       ├── trpc/                  # tRPC endpoint
│   │       ├── webhooks/              # Payment & shipping webhooks
│   │       └── cron/                  # Cron job endpoints (shipment status sync, payment reminders)
│   ├── components/
│   │   ├── ui/                        # Base UI components (shadcn/ui customized)
│   │   ├── layout/                    # Header, Footer, Sidebar, Navigation
│   │   ├── product/                   # Product card (MOQ badge, wholesale price), gallery, reviews
│   │   ├── cart/                      # Cart drawer, cart item (MOQ enforcement), summary
│   │   ├── checkout/                  # Checkout steps, shipping tier selector, split payment form
│   │   ├── shipping/                  # Shipping tier cards (Turbo/Normal/Slow), delivery estimator
│   │   ├── payment/                   # Split payment progress, remaining balance CTA, payment form
│   │   ├── order/                     # Order status timeline, shipment tracker, payment status
│   │   ├── admin/                     # Admin-specific components
│   │   ├── forms/                     # Reusable form components
│   │   └── shared/                    # Shared across all areas
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema/                # Drizzle schema files (per domain)
│   │   │   │   ├── users.ts
│   │   │   │   ├── products.ts        # Includes MOQ field, wholesale_price_toman
│   │   │   │   ├── orders.ts          # Order with split payment state machine
│   │   │   │   ├── payments.ts        # Split payments: upfront + remaining ledger
│   │   │   │   ├── shipments.ts       # Shipment with tier (turbo/normal/slow) & tracking
│   │   │   │   ├── reviews.ts
│   │   │   │   ├── categories.ts
│   │   │   │   └── notifications.ts
│   │   │   ├── migrations/            # Generated migration files
│   │   │   ├── seed.ts                # Seed data (realistic Chinese-import products, wholesale prices)
│   │   │   └── index.ts               # DB connection & client export
│   │   ├── api/
│   │   │   ├── routers/               # tRPC routers (per domain)
│   │   │   ├── middleware/            # Auth, rate limiting, logging
│   │   │   └── trpc.ts               # tRPC initialization
│   │   ├── services/                  # Business logic services
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts     # Product CRUD with MOQ validation
│   │   │   ├── order.service.ts       # Order state machine (pending → paid_partial → shipped → arrived → paid_full → delivered)
│   │   │   ├── payment.service.ts     # Split payment orchestration (40-50% upfront + remaining)
│   │   │   ├── shipping.service.ts    # Shipping tier pricing calculator & ETA engine
│   │   │   ├── notification.service.ts # Notify on payment due, shipment arrival, etc.
│   │   │   ├── search.service.ts
│   │   │   └── analytics.service.ts
│   │   └── integrations/              # Third-party integration adapters
│   │       ├── payment/               # ZarinPal, IDPay, Pay.ir, Sadad, Mellat
│   │       │   ├── types.ts           # Unified payment interface (supports partial payments)
│   │       │   ├── zarinpal.ts
│   │       │   ├── idpay.ts
│   │       │   └── factory.ts         # Payment provider factory
│   │       ├── sms/                   # Kavenegar, Ghasedak
│   │       │   ├── types.ts
│   │       │   ├── kavenegar.ts
│   │       │   └── factory.ts
│   │       ├── shipping/              # International shipping trackers + local last-mile
│   │       │   ├── types.ts           # Unified interface with tier support
│   │       │   ├── international.ts   # China-to-Iran shipment tracking
│   │       │   ├── tipax.ts           # Last-mile Iran delivery
│   │       │   └── factory.ts
│   │       ├── maps/                  # Neshan Maps / Cedar Maps
│   │       └── storage/               # S3-compatible (ArvanCloud Object Storage)
│   ├── lib/
│   │   ├── utils.ts                   # General utilities
│   │   ├── constants.ts               # App-wide constants (MOQ defaults, payment split ratios, shipping tiers)
│   │   ├── validators.ts              # Zod schemas (shared client/server) — includes MOQ & split payment validation
│   │   ├── formatters.ts              # Currency (Toman), date (Jalali), number formatting
│   │   ├── persian-utils.ts           # Persian-specific: number conversion, phone validation
│   │   ├── shipping-calculator.ts     # Calculate shipping cost & ETA per tier (Turbo/Normal/Slow)
│   │   ├── payment-calculator.ts      # Calculate split payment amounts (upfront % + remaining)
│   │   └── errors.ts                  # Custom error classes
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-cart.ts                # Cart with MOQ enforcement
│   │   ├── use-auth.ts
│   │   ├── use-shipping-tier.ts       # Shipping tier selection & cost preview
│   │   ├── use-split-payment.ts       # Split payment state tracking
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   ├── stores/                        # Zustand stores
│   │   ├── cart.store.ts              # Cart state with MOQ validation & shipping tier
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   ├── i18n/
│   │   ├── config.ts                  # i18n configuration
│   │   ├── request.ts                 # Server-side locale detection
│   │   └── messages/
│   │       ├── fa/                    # Persian translations (namespaced)
│   │       │   ├── common.json
│   │       │   ├── auth.json
│   │       │   ├── products.json      # Includes MOQ labels, wholesale terminology
│   │       │   ├── cart.json          # MOQ warnings, shipping tier labels
│   │       │   ├── checkout.json      # Split payment instructions
│   │       │   ├── shipping.json      # Turbo/Normal/Slow tier names & descriptions
│   │       │   ├── orders.json        # Order states including split payment statuses
│   │       │   ├── admin.json
│   │       │   └── errors.json
│   │       └── en/                    # English translations
│   ├── styles/
│   │   ├── globals.css                # Tailwind directives + CSS custom properties
│   │   ├── design-tokens.css          # Design system tokens (SilkRoad brand)
│   │   └── fonts.css                  # Font face declarations
│   └── types/
│       ├── index.ts                   # Shared TypeScript types
│       ├── api.ts                     # API response types
│       ├── database.ts               # Inferred DB types
│       ├── shipping.ts               # ShippingTier enum, ShippingQuote, ETA types
│       └── payment.ts                # SplitPayment, PaymentPhase, PaymentStatus types
├── tests/
│   ├── unit/                          # Vitest unit tests
│   │   ├── moq-validation.test.ts     # MOQ enforcement logic
│   │   ├── split-payment.test.ts      # Split payment calculation logic
│   │   └── shipping-calculator.test.ts # Shipping tier pricing & ETA
│   ├── integration/                   # Integration tests
│   ├── e2e/                           # Playwright E2E tests
│   │   ├── auth.spec.ts
│   │   ├── product-browsing.spec.ts
│   │   ├── wholesale-checkout.spec.ts # Full checkout: MOQ → shipping tier → split payment
│   │   ├── pay-remaining.spec.ts      # Pay remaining balance flow
│   │   └── rtl-rendering.spec.ts
│   ├── fixtures/                      # Test data & mocks
│   └── helpers/                       # Test utilities
└── scripts/
    ├── seed-db.ts                     # Database seeding script (Chinese import products)
    ├── generate-sitemap.ts            # Sitemap generation
    └── health-check.ts               # Health check endpoint logic
```

---

## 🛠️ Tech Stack (Locked)

| Layer            | Technology                                                      |
| ---------------- | --------------------------------------------------------------- |
| Framework        | Next.js 15 (App Router, Server Components, Server Actions)      |
| Language         | TypeScript 5.x (strict mode)                                    |
| Styling          | Tailwind CSS v4 + custom design tokens + CSS custom properties  |
| UI Components    | shadcn/ui (heavily customized) + Radix UI primitives            |
| Animation        | Framer Motion                                                   |
| State (client)   | Zustand (minimal — prefer server state)                         |
| Server State     | TanStack Query v5 + tRPC                                        |
| Forms            | React Hook Form + Zod validation                                |
| ORM              | Drizzle ORM                                                     |
| Database         | PostgreSQL 16 (Supabase or self-hosted)                         |
| Cache            | Redis (Upstash or self-hosted)                                  |
| Queue            | BullMQ (Redis-backed)                                           |
| Auth             | Custom (JWT + refresh tokens + OTP) — no US-dependent providers |
| i18n             | next-intl                                                       |
| Search           | PostgreSQL full-text search (+ Meilisearch if needed later)     |
| Storage          | S3-compatible (ArvanCloud Object Storage or MinIO)              |
| Email            | Resend or self-hosted SMTP (sanctions-safe)                     |
| SMS              | Kavenegar or Ghasedak                                           |
| Payments         | ZarinPal, IDPay, Pay.ir (via unified abstraction — must support partial/split payments) |
| Shipping         | International freight tracking + Tipax, Post Pishtaz, Chapar (last-mile Iran) |
| Maps             | Neshan Maps API                                                 |
| Testing          | Vitest + Playwright + axe-core                                  |
| CI/CD            | GitHub Actions                                                  |
| Container        | Docker (multi-stage builds)                                     |
| Hosting          | ArvanCloud / Liara.ir / Hetzner EU (hybrid)                     |
| CDN              | ArvanCloud CDN                                                  |
| Monitoring       | Grafana + Prometheus + Loki (or ArvanCloud monitoring)          |
| Analytics        | Matomo (self-hosted) or custom event tracking                   |

---

## 📝 Code Conventions

### Naming
- **Files:** `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- **Components:** PascalCase (`ProductCard.tsx`)
- **Hooks:** `use-` prefix, kebab-case file (`use-cart.ts`), camelCase export (`useCart`)
- **Types/Interfaces:** PascalCase, prefix interfaces with `I` only if conflicting with class names
- **Constants:** UPPER_SNAKE_CASE for true constants, camelCase for config objects
- **Database tables:** snake_case plural (`product_variants`, `order_items`, `split_payments`)
- **API routes:** kebab-case paths (`/api/payment-callback`)
- **i18n keys:** dot-notation namespaced (`products.card.addToCart`, `shipping.tier.turbo`)

### Components
- One component per file (small helpers can be co-located)
- Export components as named exports (not default) — except page.tsx and layout.tsx
- Props interface defined above component, named `{ComponentName}Props`
- Use server components by default; add `'use client'` only when needed
- Wrap client interactivity in the smallest possible client component

### TypeScript
- `strict: true` in tsconfig — no overrides
- No `any` — use `unknown` and narrow with type guards
- Zod schemas as the single source of truth for validation; infer types from them
- Use `satisfies` operator for type-safe object literals
- Prefer `interface` for object shapes, `type` for unions/intersections

### Imports
```typescript
// Order: 1) React/Next, 2) External libs, 3) Internal aliases, 4) Relative
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/formatters';
import { ProductImage } from './ProductImage';
```

### Path Aliases
```json
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/server/*": ["./src/server/*"],
  "@/lib/*": ["./src/lib/*"]
}
```

---

## 💰 Split Payment Rules

1. **Upfront Payment (40–50%):** Admin configures the exact percentage per product or globally (default: 50%). Buyer must pay this amount at checkout to confirm the order. Payment gateway receives exactly this partial amount.
2. **Remaining Payment (50–60%):** When shipment arrives in Iran and is verified by the company, the buyer is notified to pay the remaining balance. Only after full payment is the product released for last-mile delivery.
3. **Payment States:** `pending` → `upfront_paid` → `shipped` → `arrived_in_iran` → `remaining_paid` → `delivered`. Each state transition triggers notifications (SMS + in-app).
4. **Overdue Handling:** If remaining payment is not made within X days of arrival notification, the order may be cancelled and upfront payment forfeited (configurable policy).
5. **Split Payment UI:** Checkout page must clearly show the split: "Pay now: ۵۰,۰۰۰,۰۰۰ تومان (50%)" and "Pay on arrival: ۵۰,۰۰۰,۰۰۰ تومان (50%)". Order detail page must show payment progress bar.

---

## 🚚 Shipping Tier Rules

1. **Three tiers must be selectable at checkout** for each order:
   - **Turbo (اکسپرس):** Air freight. ETA: 7–15 business days. Highest cost.
   - **Normal (عادی):** Mixed transport (air + land). ETA: 20–35 business days. Medium cost.
   - **Slow (اقتصادی):** Sea freight. ETA: 45–70 business days. Lowest cost.
2. **Shipping cost** is calculated per order based on weight, volume, and tier. Displayed clearly before checkout confirmation.
3. **Delivery estimates** are shown in Jalali calendar format with a date range.
4. **Tracking:** Each shipment has a status timeline: `processing_in_china` → `shipped_from_china` → `in_transit` → `customs_clearance` → `arrived_in_iran` → `last_mile_delivery` → `delivered`.
5. **Tier-specific UI:** Each shipping tier has a distinct visual card with icon, name, ETA range, and price. The selected tier is highlighted.

---

## 📦 Minimum Order Quantity (MOQ) Rules

1. **Every product must have an MOQ field** (integer, minimum 1). Typical values: 100, 500, 1000, 5000.
2. **Product card** must display MOQ badge prominently (e.g., "حداقل سفارش: ۱,۰۰۰ عدد").
3. **Product detail page** must show MOQ with clear explanation.
4. **Cart validation:** If quantity < MOQ, show inline error and prevent checkout. Cart item quantity input must default to MOQ and not allow values below it.
5. **Bulk pricing tiers (optional future feature):** Discounted price for quantities above certain thresholds (e.g., 1000 units = X Toman/unit, 5000 units = Y Toman/unit).

---

## 🌍 RTL & Farsi Rules

1. **Direction:** Set `dir="rtl"` on `<html>` for Persian locale. Use `logical` CSS properties (`margin-inline-start` not `margin-left`).
2. **Typography:** Primary Persian font: Vazirmatn (variable weight). Latin fallback: Inter. Load via `next/font/local` with `font-display: swap`. Subset Persian fonts aggressively.
3. **Numbers:** Convert all user-facing numbers to Persian numerals (۰۱۲۳۴۵۶۷۸۹) using `persian-utils.ts`. Keep numbers in Latin for code/data.
4. **Currency:** Always display as `۱,۲۳۴,۵۶۷ تومان` (Toman, not Rial, for user-facing — store as Rial internally, divide by 10 for display). Right-aligned in RTL.
5. **Calendar:** Use `jalaali-js` or `date-fns-jalali` for Shamsi/Jalali calendar. All user-facing dates in Jalali format: `۱۴۰۵/۰۱/۱۷`.
6. **Phone:** Validate Iranian mobile numbers: `09XXXXXXXXX` (11 digits). Format with leading zero.
7. **Icons:** Mirror directional icons (arrows, chevrons) in RTL. Use `rtl:rotate-180` Tailwind class.
8. **Layout:** Test every component in both RTL and LTR. Use Playwright visual regression tests.

---

## 🔐 Security Rules

1. **Never** store secrets in code. Use environment variables. `.env.local` is gitignored.
2. **Always** validate input on the server, even if validated on the client. Use Zod.
3. **Always** use parameterized queries (Drizzle handles this). Never concatenate SQL.
4. **Always** sanitize user-generated HTML (DOMPurify) before rendering.
5. **Always** set security headers via `next.config.ts` `headers()`.
6. **Always** use CSRF tokens for state-changing operations.
7. **Always** rate-limit auth endpoints (login, register, OTP).
8. **Always** log security events (failed logins, permission errors) with structured logging.
9. **Never** expose stack traces or internal errors to the client. Use generic error messages.
10. **Never** use `dangerouslySetInnerHTML` without sanitization.
11. **Rotate** JWT access tokens (15 min) and refresh tokens (7 days).
12. **Hash** passwords with Argon2id (preferred) or bcrypt (fallback).
13. **Split payment security:** Validate payment amounts server-side. Never trust client-calculated split amounts. Verify upfront % matches admin-configured rate.

---

## 🧪 Testing Rules

1. **Unit tests** for all utility functions, formatters, validators (`/tests/unit/`)
2. **Integration tests** for API routes and database operations (`/tests/integration/`)
3. **E2E tests** for all critical user flows (`/tests/e2e/`)
4. **SilkRoad-specific tests:** RTL rendering, Jalali date formatting, Toman currency display, Persian numeral conversion, OTP flow, payment gateway mock flows, **split payment flow (upfront + remaining)**, **MOQ validation at cart and checkout**, **shipping tier selection and cost calculation**, **order state transitions through split payment lifecycle**
5. **Performance tests:** Lighthouse CI in GitHub Actions, fail build if LCP > 3s
6. **Accessibility tests:** axe-core integration, fail on any A or AA violations
7. **Test naming:** `describe('ProductCard')` → `it('should display wholesale price in Toman format with MOQ badge')`
8. **Minimum coverage:** 80% for services, 90% for validators/formatters

---

## 📦 Git & CI/CD Rules

### Commits
```
feat(products): add MOQ validation to product listing
feat(checkout): implement split payment flow (40-50% upfront)
feat(shipping): add Turbo/Normal/Slow tier selector
fix(checkout): handle Toman rounding edge case in split payment
fix(cart): enforce MOQ minimum in quantity input
chore(deps): update drizzle-orm to 0.35.x
docs(api): add split payment webhook documentation
test(e2e): add wholesale checkout flow with split payment
refactor(auth): extract OTP verification to service
perf(images): implement AVIF conversion pipeline
security(auth): add rate limiting to OTP endpoint
```

### Branches
- `main` — production (protected, requires PR + review)
- `staging` — staging environment
- `dev` — development integration
- `feat/xxx` — feature branches
- `fix/xxx` — bug fix branches
- `hotfix/xxx` — production hotfixes

### CI Pipeline (GitHub Actions)
```
Push → Lint (ESLint + Prettier check)
     → Type check (tsc --noEmit)
     → Unit tests (Vitest)
     → Integration tests
     → Build (next build)
     → Security scan (npm audit + Snyk)
     → E2E tests (Playwright on built app)
     → Lighthouse CI
     → Deploy to staging (on dev branch)
     → Deploy to production (on main branch, manual trigger)
```

---

## ⚡ Performance Budgets

| Metric               | Target         |
| -------------------- | -------------- |
| LCP                  | < 2.5s (4G)   |
| FID / INP            | < 100ms        |
| CLS                  | < 0.1          |
| TTI                  | < 3.5s (4G)    |
| JS bundle (initial)  | < 150 KB gzip  |
| Total page weight    | < 500 KB gzip  |
| Lighthouse (mobile)  | > 90 all cats   |

---

## 🚫 Forbidden Practices

- No `console.log` in production code (use structured logger)
- No `// @ts-ignore` or `// @ts-expect-error` without linked issue
- No `!important` in CSS (except for third-party overrides, documented)
- No inline styles (use Tailwind classes or CSS modules)
- No client-side data fetching where server components suffice
- No hard-coded strings in UI (everything goes through i18n)
- No US-sanctioned service dependencies in critical path (auth, payments, hosting)
- No storing raw credit card data (use tokenized payment gateways)
- No `SELECT *` queries — always specify columns
- No API routes without authentication middleware (except public routes, explicitly marked)
- No trusting client-side split payment calculations — always re-calculate server-side
- No allowing cart checkout if any item quantity < its MOQ

---

## 📋 Agent Review Checklist

Before any phase is marked complete, verify:

- [ ] All TypeScript compiles with no errors (`tsc --noEmit`)
- [ ] ESLint passes with zero warnings
- [ ] All unit tests pass
- [ ] E2E tests pass for affected flows
- [ ] RTL rendering verified visually
- [ ] Persian text/numbers display correctly
- [ ] No security vulnerabilities in `npm audit`
- [ ] Performance budget not exceeded
- [ ] All new strings added to i18n files
- [ ] API endpoints have input validation (Zod)
- [ ] Error boundaries cover new components
- [ ] Accessibility: no axe-core violations
- [ ] Documentation updated if architecture changed
- [ ] Structured logging for new server-side operations
- [ ] Split payment amounts validated server-side
- [ ] MOQ enforced at both UI and API level
- [ ] Shipping tier selection works correctly with cost calculation
- [ ] Order state machine transitions are correct and logged

---

*This document is maintained by AMIR (Product Manager & Tech Lead) and reviewed by the entire team. Last updated: Phase 0.*

---

## 🚧 Repository Status (Phase 0 — Initial Scaffold)

The folder structure documented above is the **target architecture**. The repo currently contains only the initial Next.js 15 scaffold:

- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env.example`
- `src/app/layout.tsx` (RTL Persian root layout), `src/app/page.tsx` (placeholder home), `src/styles/globals.css` (Tailwind v4 + brand tokens)

Most directories listed in the Folder Structure section (server/, components/, integrations/, tests/, docs/architecture/, etc.) **do not exist yet** and should be created as features are implemented. Do not waste time searching for them.

### Common commands

| Action | Command |
| --- | --- |
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Lint | `pnpm lint` |
| Type check | `pnpm typecheck` |
| Unit tests | `pnpm test` |
| Run a single unit test | `pnpm test -- path/to/file.test.ts` |
| E2E tests | `pnpm test:e2e` |

Vitest, Playwright, Drizzle, tRPC, next-intl, and the rest of the locked stack are **declared as devDependencies but not yet wired up** — add their config files (`vitest.config.ts`, `playwright.config.ts`, `drizzle.config.ts`, etc.) as the corresponding feature work begins.
