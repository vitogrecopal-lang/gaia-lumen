# Gaia-Lumen card report checkout

Owner authorized a separate Stripe account Gaia-Lumen (acct_1UX0ShCZaUV3GJUR),
5.00 EUR per one-time report, alongside native CRO. The owner confirmed the
existing EUR settlement account ending 1852 instead of the earlier supplied
IBAN. Read-only dashboard checks showed automatic daily payouts. No bank
account or payout schedule was changed, and no payout or card charge executed.

The owner explicitly authorized creating a dedicated restricted live key and
saving it as a Secret only in production gaia-lumen-originale. Permissions:
Checkout Sessions, Products, Prices: write. No payouts, transfers or refunds.
The Vercel Marketplace Stripe provisioner only offered US/CA sandbox accounts;
the owner's separate existing live Italian account was connected directly.
No new sandbox or Hub Energetico integration was provisioned.

Configuration: GAIA_STRIPE_SECRET_KEY (Secret), GAIA_STRIPE_PUBLIC_KEY (Config),
GAIA_STRIPE_ENABLED=true. The existing GAIA_CRO_ORDER_KEY is never rotated or
exposed; a separate derived key and AAD namespace protect Stripe invoice tokens.
Production secrets are never pulled into local files. Preview is off by default.

/pagamenti.html opens hosted Stripe Checkout only after an explicit click. Card data
is handled by Stripe on checkout.stripe.com. The buyer returns to pagamenti.html
and verifies the order for download. No invoice token is put in the return URL. Preparation compiles a real report before payment and
stores it in an authenticated encrypted invoice. The buyer must save a private
JSON reference before opening the payment form. The file plus Stripe session
ID supports cold-start recovery. Losing it can lose access; this is disclosed.

API: GET /api/stripe/config; POST order, resume, verify, report. Every report
download retrieves the Checkout session server-side and requires live payment
mode, complete+paid, exactly 500 EUR cents, invoice UUID and a SHA-256 digest
of the encrypted token in Stripe metadata. No browser success flag unlocks
content. A paid session cannot unlock another invoice. The report has no other
fulfillment side effects; repeated verified downloads are safe. No webhook or
local database is required for on-demand verification, and no email delivery
is promised. In uncertain states, retry verification instead of payment.

Stripe API version pinned to 2025-03-31.basil (hosted ui_mode). HTTPS requests
go only to api.stripe.com/v1/checkout/sessions; IDs validated before interpolation.
No API for refunds, payouts, conversions or changing bank details is implemented.
5 EUR and 5 CRO are distinct prices. Existing CRO payments/recovery are preserved.
Native CRO still goes to the configured exchange deposit address; automatic
CRO/EUR conversion and bank settlement need separate approved merchant onboarding.

Validation: node scripts/stripe-payments-test.mjs; existing CRO tests and syntax
checks. Live unpaid session tests verify provider authentication and report denial.
Do not claim a successful card-funded purchase or received payout without evidence.

Official references:
- https://docs.stripe.com/api/checkout/sessions/create
- https://docs.stripe.com/payments/checkout/fulfill-orders
- https://docs.stripe.com/keys


The embedded form did not render in the browser check. Hosted Checkout was
selected instead; the original self-only CSP is preserved on the whole site.
No external Stripe.js script or iframe is loaded on Gaia-Lumen.


