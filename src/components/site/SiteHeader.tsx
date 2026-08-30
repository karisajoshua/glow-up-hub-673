import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/sstc-logo.jpg.asset.json";
import { useIsAdmin, useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/frameworks", label: "Frameworks" },
  { to: "/schools", label: "Schools" },
  { to: "/programs", label: "Programs" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const navigate = useNavigate();
  const { user } = useSession();
  const isAdmin = useIsAdmin(user?.id);
  const accountTo = isAdmin ? "/admin" : "/my-application";
  const accountLabel = isAdmin ? "Dashboard" : "My Application";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/20 bg-surface/85 backdrop-blur-xl transition-all duration-300">
      <div
        className={`container-max flex items-center justify-between px-margin-mobile transition-all duration-300 md:px-margin-desktop ${
          scrolled ? "h-20" : "h-24 md:h-28"
        }`}
      >
        <Link to="/" className="group flex items-center gap-4">
          <img
            src={logoAsset.url}
            alt="SustainaSpace Training Center crest"
            className={`rounded-full object-contain shadow-sm transition-all duration-300 group-hover:scale-105 ${
              scrolled ? "h-14 w-14" : "h-16 w-16 md:h-20 md:w-20"
            }`}
          />
          <span className="font-display text-title-lg font-bold text-primary md:text-headline-md">
            S-STC
          </span>
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
          {user ? (
            <>
              <Link
                to={accountTo}
                className="hidden rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary md:inline-flex"
              >
                {accountLabel}
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="hidden label-caps px-3 py-3 text-on-surface-variant transition-colors hover:text-secondary md:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden label-caps px-3 py-3 text-on-surface-variant transition-colors hover:text-secondary md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/apply"
                className="hidden rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary md:inline-flex"
              >
                Apply Now
              </Link>
            </>
          )}
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
            {user ? (
              <>
                <Link
                  to={accountTo}
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-button text-on-primary"
                >
                  {accountLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="label-caps mt-4 py-2 text-left text-on-surface-variant"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="label-caps border-b border-outline-variant/20 py-4 text-on-surface-variant"
                >
                  Sign in
                </Link>
                <Link
                  to="/apply"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-button text-on-primary"
                >
                  Apply Now
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
