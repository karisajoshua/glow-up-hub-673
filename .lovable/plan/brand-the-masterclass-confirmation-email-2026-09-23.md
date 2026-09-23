# Brand the masterclass confirmation email

## Goal
Upgrade the existing paid-participant confirmation email so it looks recognizably S-STC while preserving the current payment verification, joining-link security, delivery tracking, and resend behavior.

## Changes
- Add the official S-STC crest at the top of the email using a public absolute image URL that external email clients can load.
- Replace the basic text-only header with an S-STC blue-and-green branded masthead, organization name, and sustainability training descriptor.
- Improve the confirmation hierarchy: payment-confirmed label, participant greeting, masterclass title, and a clean date/time/venue summary.
- Make the Google Calendar/Meet button prominent, retain the plain joining URL as a fallback, and keep the existing joining instructions.
- Add a polished organization footer with S-STC contact details and website link.
- Keep the layout mobile-friendly and email-client-safe using the existing React Email components and inline styles.
- Update the email preview data if needed, then verify both HTML and plain-text rendering without sending a real participant email.

## Technical notes
- Change only the existing masterclass confirmation template and any minimal server-side template data needed for the logo URL.
- Do not expose the session link publicly or alter registration/payment logic.
- Do not embed a relative asset path in the email; use the published S-STC logo URL so Gmail and other inboxes can display it.
- Run the project type check and inspect the local email preview after implementation.
