# Brand the masterclass registration PDF precisely

Update the generated registration PDF so it visibly matches the S-STC website and uses the official crest.

## PDF branding

- Load the existing official S-STC crest and place it prominently in the PDF header at a clear, undistorted size.
- Replace the approximate PDF colours with the exact blue and green represented by the website’s primary and secondary brand tokens.
- Refine the header, section headings, dividers, applicant details and footer into one consistent S-STC document style.
- Keep the current masterclass information, applicant answers, submission date, fee instructions and filename unchanged.

## Reliability and verification

- Convert the crest into a format that the browser PDF generator can embed before saving the document.
- Preserve the current submit, automatic download, WhatsApp handoff and repeat-download actions.
- Generate a sample PDF, render its page as an image and inspect the complete page for logo clarity, correct proportions, colour consistency, text clipping and spacing.

## Technical details

- Update only the client-side PDF builder in the existing masterclass form.
- Reuse the existing S-STC logo asset; do not introduce a replacement logo.
- Use exact RGB equivalents of the site’s semantic blue and green tokens because the PDF library does not accept the site’s OKLCH colour values directly.
