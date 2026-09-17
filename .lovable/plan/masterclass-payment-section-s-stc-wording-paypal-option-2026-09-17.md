# Masterclass payment section: S-STC wording + PayPal option

## Changes

### 1. src/routes/masterclass.tsx — "How payment works" aside
- Replace the sentence that says Eunice replies with payment instructions so it names S-STC instead:
  "Once you send your registration PDF on WhatsApp, S-STC sends you the payment instructions and your Google Meet joining link. No payment is taken on this website."
- Update that last sentence since PayPal will now be available: e.g. "You can pay securely through our PayPal link below, or follow the payment instructions we send you after registration."

### 2. src/routes/masterclass.tsx — PayPal payment option
- Add a "Pay with PayPal" button in the same aside, linking to https://www.paypal.com/ncp/payment/CQ3XNRDHUJQJ8 (opens in a new tab with rel="noopener noreferrer").
- Style it with the site's existing button tokens (primary background, hover to secondary) and a small Material Symbols icon (e.g. `credit_card`), consistent with the "Apply now" button styling.
- Add a short caption under the button noting the fee is KSh 500 and to include your name when paying so we can match your payment to your registration.

## Verification
- Typecheck with `bunx tsgo --noEmit`.
- Playwright check on /masterclass: aside shows the S-STC wording and the PayPal button with the correct link.
