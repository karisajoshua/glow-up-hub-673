# Working buttons + full SEO readiness

## 1. Make every button do something

Audit result — the dead ends are the two forms; every nav link, CTA and card link already routes correctly.

- **Contact form** (`/contact`): submitting now opens the visitor's email app with a pre-filled message to info@sstc.co.ke (name, email, subject, message body), then shows the existing confirmation state.
- **Fees form** (`/fees`): "Request Fee Schedule" opens a pre-filled email to info@sstc.co.ke requesting the fee schedule for the chosen programme.
- Add basic required-field validation so a click never silently does nothing.
- Programme filters, mobile menu toggle, and all mailto/website links: verified working, left as-is.

## 2. SEO: get it index-ready

Using **https://sstc.co.ke** as the canonical base (swapped in as soon as the domain is connected).

- **Sitemap**: add `public/sitemap.xml` listing all 10 public pages (home, about, frameworks, schools, programs, apply, delivery, fees, contact, privacy).
- **robots.txt**: add the `Sitemap: https://sstc.co.ke/sitemap.xml` directive.
- **Canonical + og:url**: add a self-referencing canonical link and `og:url` to every page (currently missing everywhere).
- **Titles & descriptions**: tighten each page's title under 60 chars and description under 160 chars, each keyword-targeted (sustainability training Kenya, green skills courses, ESD, online short courses).
- **Twitter cards**: add `twitter:card`, `twitter:title`, `twitter:description` per page so link previews are complete.
- **Structured data (JSON-LD)**:
  - Root: `EducationalOrganization` with name, logo, URL, email, sameAs.
  - `/programs`: `ItemList` of `Course` entries.
  - `/apply`, `/fees`, `/contact`, deep pages: `BreadcrumbList`.
- **On-page structure**: confirm one `<h1>` per page, headings in order, descriptive `alt` on every image, `loading="lazy"` on below-fold images.
- Run an SEO review scan at the end and fix whatever it flags.

## Reality check on "rank right away"

Everything above is what's technically in your control, and it's the full checklist. Actual ranking also needs the domain live and verified in Google Search Console — Google won't index sstc.co.ke until it resolves to the site. Once you connect the domain I can walk you through submitting the sitemap so indexing starts within days rather than weeks.

## Technical notes

- Head tags stay in each route's `head()` (TanStack pattern); canonical goes on leaf routes only, never `__root`.
- Root keeps sitewide defaults only (og:site_name, og:type, organisation JSON-LD).
- Forms stay client-side — no backend added.
