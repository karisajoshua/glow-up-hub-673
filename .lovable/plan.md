# Green Job Readiness Masterclass — page, form and PDF to WhatsApp

Add the masterclass as a promoted item on the site with a short application form that turns into a branded PDF the applicant sends to WhatsApp.

## Home page banner

A slim, eye-catching strip near the top of the home page (below the hero cards) with:
- "Green Job Readiness Masterclass" and the line "Building the skills, evidence and professional profile employers want in the green economy."
- Date Saturday 26th September, 9:00 am – 12:00 pm, Virtual (Google Meet), KSh 500.
- Buttons: "See details" and "Apply now" going to the new page.

Styled with the existing S-STC blue/green tokens and the same scroll-reveal motion used elsewhere — no new look.

## Masterclass page (`/masterclass`)

- Headline, tagline and the "From 'I want a green job' to 'I can demonstrate that I am ready for one.'" quote.
- Facilitator block: Eunice Barasa, Sustainability Advocate | Development Practitioner, +254 739775180.
- "What You'll Gain" — four points: understand the green job market; what employers actually look for; 4 key green skills + transferable skills; build your CV and professional profile for green jobs.
- Details row: date, time, virtual (Google Meet), investment KSh 500.
- Fee note: KSh 500 payment is arranged over WhatsApp after the form is sent.
- Its own page title, description and social preview text; added to the sitemap and to the Services/menu links.

## Apply form and PDF

Form on the same page (opens a section/dialog) asking for:
- Full name, phone number, email, occupation / current role, and how they heard about the masterclass.
- All fields checked before submit, with clear error messages.

On submit:
1. A branded PDF is generated in the browser — S-STC crest, brand colours, masterclass title, session details, the applicant's answers, submission date, and a fee/next-steps footer.
2. The PDF downloads automatically with a filename like `SSTC-Masterclass-Jane-Doe.pdf`.
3. WhatsApp opens to +254 739775180 with a prefilled message naming the applicant and the masterclass, asking them to attach the just-downloaded PDF (one tap).
4. A confirmation panel replaces the form, with a "Download PDF again" and "Open WhatsApp again" button in case the applicant closed something.

## Admin visibility

Each submission is also saved in the backend so registrations appear in the admin area: a small "Masterclass registrations" list (name, phone, email, occupation, date) with CSV export, in the existing admin sidebar.

## Technical notes

- New route `src/routes/masterclass.tsx` (public), banner component used from `src/routes/index.tsx`, sitemap entry, header/footer links.
- PDF via `jspdf` client-side; logo drawn from the existing `src/assets/sstc-logo.jpg.asset.json` pointer; brand colours taken from the CSS tokens.
- WhatsApp handoff is a `https://wa.me/254739775180?text=...` link — no WhatsApp Business connection needed. (Fully automatic PDF sending would need a Meta-approved WhatsApp Business number; can be added later.)
- New table `masterclass_registrations` (name, phone, email, occupation, heard_about, created_at) with RLS: public insert via a server function, admin-only read through `has_role(auth.uid(),'admin')`, plus explicit GRANTs.
- Insert done through a `createServerFn` with zod validation; no anonymous client writes.
- Admin list at `src/routes/_authenticated/admin.masterclass.tsx` inside the existing `AdminShell`.
- The uploaded flyer is used as design reference only, not embedded.
