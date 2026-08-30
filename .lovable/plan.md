# Student Accounts, Application Wizard & Admin Dashboard

Turn the current static "How to Apply" page into a real online application system backed by Lovable Cloud (database, logins, file storage).

## What students get

- **Sign up / log in** at `/auth` with email + password. No email confirmation needed — they can start applying right away. Password reset included.
- **Application wizard** at `/apply` (multi-step, matching the attached paper form):
  1. School / Training Center (Sustainable Skills & Technologies, Fashion & Design, Green Technologies, Agriculture & Food Systems, Other)
  2. Personal information (name, DOB, gender, nationality, ID/passport, phone, email, residential address, county, sub-county, town, postal code)
  3. Education background (Primary, Secondary, College/University, Other — institution, years, qualification)
  4. Course information (course, mode of study: full-time/part-time/evening/weekend/online/other, preferred intake date)
  5. Employment information (status, employer, occupation, years of experience)
  6. Emergency contact (name, relationship, phone, email, address)
  7. How did you hear about us
  8. Documents upload — ID/passport copy, academic certificates, passport photo
  9. Declaration + review, then submit
  - Progress is **saved as a draft** at each step, so a student can leave and come back.
  - Each submission gets a reference number (e.g. `SSTC-2026-0042`).
- **My application** page: shows status (Submitted → Under Review → Accepted / Not Accepted / Waitlisted), the reviewer's note about next steps (payment, start date), and their uploaded documents.

## What the admin gets

- Any signed-up user with a **verified @sstc.co.ke email** is automatically an admin.
- **Dashboard** at `/admin`:
  - Stat cards: total applications, new this week, by status, by school, by mode of study.
  - Simple chart of applications over time.
  - Table of all applications: reference, name, school, course, submitted date, status — searchable and filterable by school/status, with CSV export.
- **Application detail view**: every field the student submitted, download links for their documents, status dropdown, and an internal/next-steps note (payment info, start date) that the student sees on their own page.
- Non-admins visiting `/admin` are redirected away.

## Communication

Per your choice, the app does **not** send emails yet. The admin updates the status and writes the next-steps note; the student sees it when they log in. Admin can copy the applicant's email to write from their own mail app. If you later want automated status emails from the app, that's a small add-on once the sstc.co.ke sending domain is verified.

## Technical notes

- Enable Lovable Cloud (Postgres + auth + storage).
- Tables: `profiles` (student details, auto-created on signup via trigger), `user_roles` + `app_role` enum + `has_role()` security-definer function (admin role granted by a trigger only on **verified** @sstc.co.ke emails), `applications` (one row per application with a `status` enum, `draft`/`submitted` state, `reference_no`, `admin_note`), `application_documents` (storage paths + doc type).
- RLS: students read/write only their own application while it is a draft and read-only after submit; admins read/write all via `has_role(auth.uid(),'admin')`. Explicit GRANTs for `authenticated` / `service_role`.
- Storage: private `application-documents` bucket, path-scoped per user; admins read all.
- Routes: `src/routes/auth.tsx`, `_authenticated/` gate, `_authenticated/apply.*` wizard steps, `_authenticated/my-application.tsx`, `_authenticated/admin.tsx` + `admin.$id.tsx`. Public `/apply` becomes a short explainer with "Start your application" CTA (keeps existing SEO metadata and breadcrumbs).
- Header gains session-aware sign in / account + sign out; forms validated with zod and react-hook-form; `sonner` for toasts.
- Existing design tokens, logo colours, scroll animations and page transitions are reused — no visual redesign.
