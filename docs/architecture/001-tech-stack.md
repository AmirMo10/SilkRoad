# ADR 001 — Tech Stack

**Author:** AMIR
**Status:** Accepted
**Date:** 2026-04

## Context
SilkRoad is a wholesale B2B marketplace targeting Iranian buyers importing from China. It must work reliably under Iranian network conditions, comply with sanctions constraints (no US-only services in critical path), support RTL/Persian natively, and handle split payments + MOQ enforcement at scale.

## Decision

### Locked stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript (strict) | 5.6+ |
| Styling | Tailwind CSS | 4.x |
| UI primitives | shadcn/ui (customized) + Radix | latest |
| Animation | Framer Motion | 11.x |
| Client state | Zustand (minimal) | 4.x |
| Server state | TanStack Query + tRPC | v5 / v11 |
| Forms | React Hook Form + Zod | latest |
| ORM | Drizzle | latest |
| Database | PostgreSQL | 16 |
| Cache | Redis | 7 |
| Queue | BullMQ | latest |
| Auth | Custom JWT (jose) + OTP | — |
| Password hash | Argon2id (@node-rs/argon2) | — |
| i18n | next-intl | latest |
| Storage | S3-compatible (ArvanCloud) | — |
| SMS | Kavenegar (primary), Ghasedak (fallback) | — |
| Payments | ZarinPal, IDPay, Pay.ir (unified) | — |
| Testing | Vitest, Playwright, axe-core | — |
| CI/CD | GitHub Actions | — |
| Container | Docker | — |
| Hosting | ArvanCloud / Hetzner EU hybrid | — |

## Rejected alternatives

| Rejected | Reason |
|---|---|
| Remix | Smaller ecosystem in Iran; less Next-compatible tutorials in Persian |
| Vite + custom SSR | Reinventing what Next.js gives for free |
| Prisma | Heavier runtime, generated client overhead, weaker raw-SQL escape hatch than Drizzle |
| MongoDB | Relational integrity matters for orders/payments/MOQ — Postgres is the right tool |
| Auth0 / Clerk | US-controlled; sanctions risk for Iranian users |
| Stripe | Not available in Iran |
| Vercel hosting | US-controlled; can't serve `.ir` users reliably or comply with hosting requirements |
| Material UI / Ant Design | Generic look; SilkRoad brand requires custom design system |
| Redux Toolkit | Overkill — server state lives in TanStack Query, client state is minimal |

## Consequences
- All third-party integrations must have a sanctions-aware adapter layer (see ADR 007).
- We commit to Persian-first development; English is a secondary concern.
- Self-hosted analytics (Matomo) — no Google Analytics in critical path.
