# Four Schools, Other Services, and a Mega Menu

## What changes

### 1. Schools structure (now four schools)
Rebuild `/schools` around four schools, each with its own section and a link to its programmes:

1. **School of Sustainable Professional Practice (SSPP)** — keeps the existing description. Programme list marked "Programmes announced soon" until you share the titles and descriptions.
2. **School of Sustainable Skills & Technologies** — Upcycled Textile Accessories, Eco Footwear, Solar Dryer Assembling, Weave Making, Sustainable Packaging.
3. **School of Digital Literacy** — short placeholder description until you supply copy.
4. **School of Transitional Skills** — short placeholder description until you supply copy.

The old "School of Community Based Green Skilling" section is replaced by this set (its community-skilling programme stays in the catalogue).

### 2. Programme catalogue
Add the five Sustainable Skills & Technologies programmes as cards on `/programs`, each tagged with its school. Add a **School** filter alongside the existing Level and Delivery Mode filters so visitors can narrow by school. Course JSON-LD is extended to cover the new entries.

### 3. Other Services (new page `/services`)
A new page presenting:
- **Readers Community Library** — a physical library serving the reading needs of the host community.
- **Discovery Excursions** — field trips exploring the social, economic and environmental gems of the Western block.

Each gets a hero-style card with imagery, description and a contact call-to-action. Full SEO head tags, canonical, breadcrumbs, and an entry in the sitemap.

### 4. Mega menu in the header
The main navigation gains two dropdown items:
- **Schools** — a wide mega panel with a column per school listing its programmes, plus a "View all programmes" link.
- **Services** — a smaller dropdown listing Readers Community Library and Discovery Excursions.

Behaviour: opens on hover and on keyboard focus/click on desktop, closes on Escape, outside click, or route change; fully keyboard accessible. On mobile the same items become expandable accordion sections inside the existing slide-down menu. Styling follows the current logo-derived palette and motion feel.

### 5. Application form school options
The school dropdown in the application wizard is updated to the four school names so applicants pick from the real list.

## Technical notes
- New shared data module `src/lib/schools.ts` holding the four schools, their slugs, descriptions and programme lists; consumed by the header mega menu, `/schools`, `/programs` and the application options.
- `src/components/site/SiteHeader.tsx` gains a `MegaMenu` subcomponent (state-driven, no new dependency; Motion already present for transitions).
- New route `src/routes/services.tsx`; `/schools` and `/programs` rewritten to read from the shared data module.
- `src/lib/application-options.ts` `SCHOOLS` updated; existing stored applications keep their current text values.
- Sitemap and footer link lists updated to include `/services`.

## Open items
Send the SSPP programme titles and descriptions, plus copy for Digital Literacy and Transitional Skills, and I will drop them in — the structure will already be in place.
