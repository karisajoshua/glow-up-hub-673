# Digital Career Compass Masterclass — full section on the masterclass page

Add the Digital Career Compass Masterclass to `/masterclass` as a fully detailed, well-organized section with its own application form, branded PDF and WhatsApp flow, saved separately in the backend.

## Content (from the flyer text)

New section on `/masterclass`, placed after the Green Job Readiness sections and before the "Upcoming Masterclasses" list:

- Title: "The Digital Career Compass Masterclass" with the intro paragraphs:
  - "Do you have a passion in a digital-oriented career path, or is your line of work inclined towards digital proficiency, but you just do not know where to start? We have you covered!"
  - "The Digital Career Compass Masterclass, delivered by an industry expert, will melt away all confusion and expertly point to current in-demand and must-have skills and their relevance in the green economy and job creation."
- Four "What you'll explore" cards (same card style as Green Job Readiness):
  - Explore digital career pathways — software development, data, cybersecurity, digital media, marketing, e-commerce, cloud computing and green technology.
  - Choose a suitable direction — match interests, strengths and goals with the right course, skills and career pathway.
  - Build employability and income — portfolio, practical experience, securing work, freelancing or offering digital services.
  - Develop green digital skills — how digital products affect carbon emissions; design, use and manage technology for efficiency, lower energy use and sustainable solutions.
- Details row: Date 2 October 2026 · Time 9:00 – 12:00 · Venue Google Meet · Investment KSh 500.
- "Apply now" button scrolling to its own form anchor on the same page.

## Two registrations, one page

- `MasterclassForm` gains a `masterclass` prop ("green-job-readiness" or "digital-career-compass"). Everything downstream follows it: PDF title and details block, WhatsApp message, PDF filename (`SSTC-Masterclass-Digital-Career-Compass-<Name>.pdf`), and the saved record.
- Green Job Readiness keeps its existing `#apply` form; the Digital Career Compass section gets its own form at `#apply-digital-career-compass`, each with the same validation, PDF download, WhatsApp handoff and confirmation panel.
- The "Upcoming Masterclasses" list keeps only Transitional Skills ("dates coming soon"); the Digital Career Compass card is removed from it since it is now fully detailed.

## Backend

- Migration: add a `masterclass` text column to `public.masterclass_registrations` (existing rows default to "green-job-readiness"); grants unchanged.
- `registerForMasterclass` accepts and stores the masterclass key (zod-validated).
- Admin "Masterclass registrations" page: show which masterclass each registration is for, add a filter by masterclass, and include it in the CSV export.

## Technical notes

- Data lives in `src/lib/masterclass.ts` (new `DIGITAL_CAREER_COMPASS` const; trim `UPCOMING_MASTERCLASSES` to Transitional Skills).
- Same page structure, brand tokens, PDF builder and wa.me flow as the existing form — no new dependencies.
- No new route; `/masterclass` head metadata, sitemap and menu links stay as they are.
