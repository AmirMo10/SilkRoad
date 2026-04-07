# ADR 010 — i18n Architecture

**Author:** YASMIN
**Status:** Accepted

## Library
**next-intl** (server-component native, App Router compatible).

## Locales
- **fa** — primary, default, RTL
- **en** — secondary, LTR (for international suppliers, future expansion)

## URL strategy
`[locale]` route segment: `/fa/products`, `/en/products`. Default redirects `/` → `/fa`.

## Folder structure
```
src/i18n/
├── config.ts                    # locale list, default
├── request.ts                   # server-side getRequestConfig
└── messages/
    ├── fa/
    │   ├── common.json
    │   ├── home.json
    │   ├── auth.json
    │   ├── products.json
    │   ├── cart.json
    │   ├── checkout.json
    │   ├── shipping.json
    │   ├── payment.json
    │   ├── orders.json
    │   ├── admin.json
    │   └── errors.json
    └── en/
        └── (same files)
```

## Naming convention
Dot-notation, namespaced by file:
- `home.hero.title`
- `products.card.moqLabel`
- `checkout.splitPayment.phase1Heading`
- `errors.moqNotMet` (with ICU placeholder: `حداقل تعداد سفارش {moq, number} عدد است`)

## Key principles
1. **No hard-coded strings in any UI file.** ESLint rule (custom or via i18n plugin) enforces.
2. **Pluralization via ICU** — `{count, plural, one {# عدد} other {# عدد}}`.
3. **Number/currency formatting** delegated to `formatters.ts` — i18n only handles labels.
4. **Date formatting** uses `date-fns-jalali` for fa, `date-fns` for en.
5. **Server components** read messages via `getTranslations()`.
6. **Client components** use `useTranslations()`.

## Persian wholesale terminology glossary

| English | Persian | Notes |
|---|---|---|
| Wholesale | عمده‌فروشی | |
| Minimum Order Quantity | حداقل تعداد سفارش | "MOQ" not used in UI |
| Bulk price | قیمت عمده | |
| Per-unit price | قیمت هر واحد | |
| Upfront payment | پیش‌پرداخت | Phase 1 |
| Remaining payment | پرداخت باقی‌مانده | Phase 2 |
| On arrival | هنگام تحویل | Phase 2 trigger |
| Shipping tier | روش ارسال | |
| Express / Turbo | اکسپرس / فوری | |
| Standard / Normal | عادی | |
| Economy | اقتصادی | |
| Air freight | حمل هوایی | |
| Sea freight | حمل دریایی | |
| Customs clearance | ترخیص گمرکی | |
| Tracking number | کد رهگیری | |
| Order | سفارش | |
| Cart | سبد خرید | |
| Checkout | تسویه حساب / پرداخت | |
| Invoice | فاکتور | |

## Tone
Trustworthy, premium, business-formal but warm. Address users with respectful "شما". Avoid casual slang. No exclamation marks except in success confirmations.

## Future locales
Architecture supports adding `ar`, `tr` later by dropping new folders into `messages/`.
