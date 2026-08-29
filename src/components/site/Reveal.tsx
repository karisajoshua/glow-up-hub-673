import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Reveals content on scroll. Instead of wrapping every section by hand, it
 * auto-targets the meaningful blocks inside each <main> <section>.
 * Scanning is deferred so it never races React hydration.
 */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;

    const timer = window.setTimeout(() => {
      const root = ref.current;
      if (!root) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
            const index = Math.max(0, Math.min(siblings.indexOf(el), 5));
            el.style.setProperty("transition-delay", `${index * 90}ms`);
            el.classList.add("reveal-in");
            observer?.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
      );

      const targets = new Set<HTMLElement>();
      root.querySelectorAll("main section").forEach((section) => {
        const kids = Array.from(section.children) as HTMLElement[];
        const pool = kids.length === 1 ? (Array.from(kids[0]!.children) as HTMLElement[]) : kids;
        (pool.length ? pool : kids).forEach((el) => targets.add(el));
      });

      targets.forEach((el) => {
        if (el.dataset["revealed"]) return;
        el.dataset["revealed"] = "1";
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add("reveal", "reveal-in");
          return;
        }
        el.classList.add("reveal");
        observer!.observe(el);
      });
    }, 450);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
