# Bigger logo + smooth motion across the site

## 1. Make the crest readable
- Header: grow the crest from 48px to 64px (72px on desktop), header height from 80px to 96px, and slightly shrink the "S-STC" wordmark so the crest is the focal point. Header shrinks smoothly to a compact bar (crest 48px) once the page is scrolled, so it never blocks content.
- Footer: crest grows to 96px with a white circular backing so the blue ring, leaves and lettering read clearly.
- Home hero: show the crest large (about 160px) as a brand mark, so first-time visitors can actually read "SustainaSpace Training Center — Shaping Green Practice".

## 2. Scroll reveal animations
- Add a small reusable `Reveal` wrapper (fade + 24px rise, staggered for grids/cards) driven by IntersectionObserver so sections animate in once as they enter the viewport.
- Apply it to the major blocks on every page: hero copy, philosophy, framework cards, school sections, programme cards, apply timeline, delivery grid, fees, contact.
- Respect `prefers-reduced-motion`: content appears instantly with no movement.

## 3. Page-to-page feel
- Cross-fade + slight rise transition when the route changes, with scroll reset to top so navigation feels intentional rather than jumpy.
- Smooth-scroll behaviour globally, unified easing/duration tokens, and slightly richer hover states (lift + shadow on cards, colour/scale on buttons and nav links).
- Images fade in on load to avoid hard pop-in.

## Technical notes
- Use `motion` (Framer Motion for React) for reveal, hover and route transitions; add the package.
- Motion primitives live in `src/components/site/Reveal.tsx` and a `PageTransition` wrapper used in `src/routes/__root.tsx` around `<Outlet />`.
- Easing/duration and header-scroll styling added as tokens in `src/styles.css`; no hardcoded colours.
