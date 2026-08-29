import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/frameworks", label: "Frameworks" },
  { to: "/schools", label: "Schools" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/85 backdrop-blur-xl">
      <div className="container-max flex h-20 items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link to="/" className="font-display text-headline-md font-bold text-primary">
          S-STC
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-caps text-on-surface-variant transition-colors hover:text-secondary"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "label-caps text-secondary border-b-2 border-secondary pb-1" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/apply"
            className="hidden rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary md:inline-flex"
          >
            Apply Now
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-on-surface md:hidden"
          >
            <span className="material-symbols-outlined text-3xl">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-outline-variant/20 bg-surface px-margin-mobile pb-6 pt-2 md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="label-caps border-b border-outline-variant/20 py-4 text-on-surface-variant"
                activeProps={{ className: "label-caps py-4 text-secondary border-b border-outline-variant/20" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/apply"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-button text-on-primary"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
