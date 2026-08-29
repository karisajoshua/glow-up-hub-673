# Logo, brand colours, full-width layout, and sstc.co.ke details

## 1. Use the uploaded S-STC crest as the logo
- Add the crest as a CDN-hosted asset and show it in the header (next to the "S-STC" wordmark) and in the footer.
- Generate a square favicon from the crest and replace the current default icon.

## 2. Match the site colours to the logo
The crest uses two brand colours: a cornflower blue and a leaf green, on white.
- Rework the design tokens so blue becomes the primary brand colour and green the secondary/accent, replacing the current dark-forest-green primary.
- Update surfaces to a clean white/very light blue tint, keep text contrast accessible, and refresh outlines, buttons, hover states, and the footer (footer becomes brand blue or deep green consistent with the crest).
- All changes stay in the token layer so every page updates at once — no hardcoded colours in components.

## 3. Make pages use the full width
Every page currently wraps content in a 1280px centred container, which leaves large empty margins on wide screens.
- Widen the shared max width substantially (about 1600px) and increase desktop side padding so content spans the screen while staying readable.
- Let full-bleed sections (hero, image bands, footer background) run edge to edge, with only their inner text constrained.
- Verify each page at desktop and mobile widths after the change.

## 4. Domain and email updates
Replace all references to the old domain/emails across header, footer, and every page:
- Website: `sstc.co.ke` (links to `https://sstc.co.ke`)
- General/contact: `info@sstc.co.ke`
- Admissions and application requests: `admissions@sstc.co.ke`
- Privacy contact: `info@sstc.co.ke`
- Update page metadata/descriptions that mention the old domain.

If you'd prefer different mailbox names (e.g. `learn@sstc.co.ke`), say so and I'll use those instead.

## Technical notes
- Colour tokens live in `src/styles.css` (`@theme inline` + `:root` OKLCH values); `--container-max` and `--spacing-margin-desktop` control page width.
- Logo goes through `lovable-assets` as a pointer JSON; the favicon is a real square PNG in `public/` derived from the crest, and the old `favicon.ico` is removed.
- Files touched: `src/styles.css`, `src/components/site/SiteHeader.tsx`, `src/components/site/SiteFooter.tsx`, `src/routes/__root.tsx`, and all route files for width/contact updates.
