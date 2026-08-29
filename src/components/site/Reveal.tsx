import { useEffect, useRef, type ReactNode } from "react";

/**
 * Reveals elements on scroll. Instead of requiring every section to be wrapped,
 * it auto-targets the direct children of <section> elements inside <main>.
 */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = new Set<Element>();
    root.querySelectorAll("main section").forEach((section) => {
      const kids = Array.from(section.children);
      const pool = kids.length === 1 ? Array.from(kids[0]!.children) : kids;
      (pool.length ? pool : kids).forEach((el) => targets.add(el));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
          const index = Math.min(siblings.indexOf(el), 5);
          el.style.transitionDelay = `${index * 90}ms`;
          el.classList.add("reveal-in");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add("reveal", "reveal-in");
        return;
      }
      el.classList.add("reveal");
      observer.observe(el);
    });

    return () => observer.disconnect();
  });

  return <div ref={ref}>{children}</div>;
}
