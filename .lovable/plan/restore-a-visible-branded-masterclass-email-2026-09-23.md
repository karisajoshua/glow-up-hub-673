# Restore a visible, branded masterclass email

## Goal
Keep the official S-STC logo and organization branding, while restoring the clear content and dependable layout of the earlier confirmation email in real inboxes.

## Changes
- Replace the newer decorative layout with a simpler email-safe structure that works reliably across Gmail, Outlook, and mobile mail apps.
- Keep the official S-STC crest at the top, with a visible text-based S-STC name beneath it as a fallback if images are blocked.
- Restore a straightforward content order: payment confirmation, participant greeting, masterclass name, date, time, venue, joining button, full joining link, preparation notes, and S-STC contacts.
- Use high-contrast dark text on white throughout the main message so content remains readable even when an inbox removes or alters styling.
- Keep the blue-and-green brand accents restrained to the header, button, session-details border, and footer.
- Preserve the existing subject, payment confirmation trigger, shared session link, resend action, duplicate-send protection, and delivery recording.

## Verification
- Render and inspect both the HTML email and its plain-text fallback.
- Confirm the logo loads from the public S-STC website.
- Check that all participant and session content remains visible when background colors or images are unavailable.
- Run the project type check and verify the email preview opens without rendering errors.

## Current findings
- The sender domain is verified and operational.
- Recent confirmation messages were accepted for sending, so the issue is the received message presentation rather than email delivery.
- The current template contains all required data, but its newer presentation should be simplified for broader inbox compatibility.
