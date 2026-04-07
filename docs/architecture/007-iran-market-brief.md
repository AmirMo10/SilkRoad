# ADR 007 — Iran Market Brief

**Author:** PARISA
**Status:** Accepted (initial; living document)

## Payment gateways

| Gateway | Partial-payment support | Settlement | Fee | Notes |
|---|---|---|---|---|
| **ZarinPal** | No native split — use 2 separate transactions | T+1 | 1% | Most popular, easiest integration |
| **IDPay** | No native split — same approach | T+1 | 1% + flat | Good developer docs, sandbox |
| **Pay.ir** | No native split | T+1 | ~1% | Backup |
| **Sadad / Mellat** | Bank-direct, more reliable for large amounts | Same day | Negotiated | Use for high-value Phase 1 |

**Decision:** Use ZarinPal as primary, IDPay as fallback. Implement SilkRoad's split logic at the application layer (each phase = independent gateway transaction recorded against the same `orders.id`). The unified `PaymentProvider` interface (FARHAD) abstracts this so we can swap or add gateways later.

## Logistics

### China → Iran freight forwarders (shortlist)
Will be selected per category based on volume and tier. The platform integrates with their tracking APIs via FARHAD's adapter pattern. No vendor lock-in.

### Last-mile in Iran
- **Tipax** — most coverage, reliable for urban
- **Post Pishtaz** — government postal, cheapest, slower
- **Chapar** — express, urban-only
- **Snap Box** — same-day intra-city

Adapter interface in `src/server/integrations/shipping/`.

## Customs & legal
- Wholesale imports above certain thresholds require commercial card (کارت بازرگانی) — held by the trading company, not buyers.
- VAT (مالیات بر ارزش افزوده) applies on the sale to the Iranian buyer — handled in invoicing.
- Foreign exchange compliance — payments to Chinese suppliers handled by the company outside the platform.

## Sanctions awareness
- **Avoid in critical path:** AWS, Google Cloud, Vercel, Netlify, Cloudflare (mostly), Stripe, Auth0, Twilio, SendGrid.
- **Use:** ArvanCloud (compute, CDN, object storage, DBaaS), Liara, IranServer, Hetzner EU as a safe non-US fallback.
- **NPM registry:** mirror via `registry.npmmirror.com` or self-hosted Verdaccio for build resilience.

## Buyer behavior (wholesale segment)
- Trust signals matter heavily: company commercial card visible, real address, real phone support.
- Phone OTP preferred over email login.
- Telegram and WhatsApp are critical support channels.
- Bulk-order patterns: multiples of 100, 500, 1000, 5000 — set MOQ + step accordingly.
- Buyers expect to negotiate; platform should expose a "request quote for >5000 units" path (post-MVP).

## Calendar / promotions
- **Nowruz (Mar 20):** biggest sales window. Pre-order push 2 weeks before.
- **Yalda (Dec 21):** secondary push.
- **Ramadan:** slower B2B activity, lighter campaigns.

## Communication channels
- SMS: Kavenegar (primary), Ghasedak (backup).
- Email: Resend or self-hosted Postfix relay.
- Telegram: bot for support handoff (post-MVP).

## Open research items
- Confirm 2026 ZarinPal API version + partial-payment status.
- Confirm ArvanCloud Managed Postgres pricing tiers.
- Identify 2 candidate freight forwarders for Phase 2 onboarding.
