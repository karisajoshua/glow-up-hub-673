# Admin routing fix, dashboard redesign, resumable student application

## 1. Staff sign-in lands on the dashboard

Right now sign-in always sends everyone to the application wizard, so an `@sstc.co.ke` admin has to navigate to `/admin` by hand. After a successful sign-in (and on the "already signed in" check that runs when the page loads), the app will look up the account's admin role and redirect staff to `/admin`, students to their application. The same rule applies to the auth gate landing, so refreshing while signed in keeps staff on the dashboard.

## 2. Admin dashboard redesign

- New shell with a **collapsible left side menu** (Overview, Applications, By school, By status, Settings-style links), collapsing to icons only, remembered between visits, and turning into a slide-over drawer on mobile.
- Overview area gets proper **data visualisation** using the charting library already in the project, in the existing brand colours:
  - Applications over time (area/line chart, last 12 weeks)
  - Applications by status (donut chart with legend)
  - Applications by school (horizontal bar chart)
  - Mode of study split (bar chart)
  - Refreshed stat cards (total, new this week, awaiting review, accepted, conversion rate)
- The applications table keeps search, school/status filters and CSV export, moved into its own "Applications" section of the shell with tidier spacing and status pills.
- Non-admin visitors keep the current "staff only" message.

## 3. Students can return and finish unfinished sections

- `/my-application` gains a **completion checklist**: each of the nine sections shows Complete / Incomplete, with a "Finish this section" link that opens the wizard directly on that step.
- The wizard accepts a step in the URL, so those links jump straight to the right section instead of restarting at step 1.
- Opening `/application` with a saved draft resumes at the first incomplete section rather than step 1, and the step chips show a tick for completed sections.
- Submitted applications stay read-only (unchanged behaviour).

## Technical notes

- `src/routes/auth.tsx`: after `signInWithPassword`/session check, query `user_roles` for `admin` and navigate to `/admin` or `/application`.
- `src/routes/_authenticated/admin.tsx`: split into a sidebar shell + section components; add Recharts (already a dependency) charts; keep the existing Supabase query and admin role check.
- New `src/components/admin/AdminShell.tsx` (sidebar + collapse state in `localStorage`).
- `src/routes/_authenticated/application.tsx`: add validated `?step=` search param, `useSearch` driven step state, resume-at-first-incomplete logic, and export a shared `sectionStatus(form, education, docs, declaration)` helper (moved to `src/lib/application-options.ts` or a new `application-progress.ts`) so both routes agree on what "complete" means.
- `src/routes/_authenticated/my-application.tsx`: render the checklist from that shared helper with `<Link to="/application" search={{ step }}>`.
- No database or RLS changes; all colours come from existing design tokens.
