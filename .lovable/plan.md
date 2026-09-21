# Send the Google Meet link by email when you confirm payment

Each registration gets a payment status. When you mark someone as paid in the admin Masterclass list, they immediately receive a branded S-STC email with the joining link and session details.

## What you will see in admin

- The Masterclass registrations list gains a status column: Pending payment / Paid, and a "Mark as paid" button on each pending row.
- Marking as paid records who confirmed it and when, then sends the confirmation email. The row shows "Email sent" (or the reason it could not be sent, e.g. the address bounced earlier).
- A "Resend email" button for anyone already marked paid.
- A small settings panel at the top of the page: for each masterclass (Green Job Readiness, Digital Career Compass) you paste the Google Meet link and can edit it any time. New emails use the current link.
- Filters and the CSV export include payment status.

## The email the applicant receives

Branded to match the site (S-STC crest, blue/green, white background):
- Subject: your place in the masterclass is confirmed.
- Their name, the masterclass title, date, time and venue.
- The Google Meet link as a clear button plus the plain link text.
- A short "what to bring / be online 5 minutes early" note and S-STC contact line.

If no meeting link is saved yet for that masterclass, marking as paid is blocked with a message asking you to add the link first — so nobody gets an email without a link.

## One-time setup

Emails must come from a domain you own, so we set up sending on sstc.co.ke first. I will start that setup; you approve the short domain step, and sending activates automatically once it verifies. Until then the rest of the flow works and I will flag any email that could not go out.

## Technical notes

- Migration: add `payment_status` ('pending' | 'paid'), `paid_at`, `paid_by`, `confirmation_email_sent_at` to `public.masterclass_registrations`; new table `public.masterclass_sessions` (masterclass key, meet_link, updated_at) with admin-only write via `has_role(auth.uid(),'admin')` and explicit GRANTs.
- New server functions (admin-gated, `requireSupabaseAuth` + role check): `confirmMasterclassPayment`, `resendMasterclassConfirmation`, `setMasterclassMeetLink`.
- Email via Lovable managed app emails: `email_domain--scaffold_transactional_email_templates`, a new `masterclass-confirmation` React Email template, sent with `sendTemplateEmail` and an idempotency key derived from the registration id.
- No automatic PayPal webhook in this scope; PayPal-paid registrations are confirmed with the same "Mark as paid" button.
