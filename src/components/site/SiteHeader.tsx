import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/sstc-logo.jpg.asset.json";
import { useIsAdmin, useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { SCHOOL_LIST, SERVICES } from "@/lib/schools";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/frameworks", label: "Frameworks" },
  { to: "/programs", label: "Programs" },
  { to: "/masterclass", label: "Masterclass" },
  { to: "/contact", label: "Contact" },
] as const;

type MenuKey = "schools" | "services" | null;

export function SiteHeader() {
  const navigate = useNavigate();
  const { user } = useSession();
  const isAdmin = useIsAdmin(user?.id);
  const accountTo = isAdmin ? "/admin" : "/my-application";
  const accountLabel = isAdmin ? "Dashboard" : "My Application";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobileSection, setMobileSection] = useState<MenuKey>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(null);
    setOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(null);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  const triggerClass = (active: boolean) =>
    `label-caps inline-flex items-center gap-1 transition-colors ${
      active ? "text-secondary" : "text-on-surface-variant hover:text-secondary"
    }`;

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

        <div ref={navRef} className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="label-caps text-on-surface-variant transition-colors hover:text-secondary"
              activeOptions={{ exact: true }}
              activeProps={{ className: "label-caps text-secondary border-b-2 border-secondary pb-1" }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="label-caps text-on-surface-variant transition-colors hover:text-secondary"
              activeProps={{ className: "label-caps text-secondary border-b-2 border-secondary pb-1" }}
            >
              About
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setMenu("schools")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                aria-expanded={menu === "schools"}
                aria-haspopup="true"
                onClick={() => setMenu(menu === "schools" ? null : "schools")}
                className={triggerClass(menu === "schools" || pathname.startsWith("/schools"))}
              >
                Schools
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {menu === "schools" && (
                <div className="absolute left-1/2 top-full z-50 w-[min(90vw,980px)] -translate-x-1/2 pt-6">
                  <div className="grid grid-cols-2 gap-8 rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-xl lg:grid-cols-4">
                    {SCHOOL_LIST.map((s) => (
                      <div key={s.slug}>
                        <Link
                          to="/schools"
                          hash={s.slug}
                          className="mb-3 block font-display text-title-lg text-primary transition-colors hover:text-secondary"
                        >
                          {s.short}
                        </Link>
                        <ul className="space-y-2">
                          {s.programs.map((p) => (
                            <li key={p.title}>
                              <Link
                                to="/programs"
                                className="text-body-md text-on-surface-variant transition-colors hover:text-secondary"
                              >
                                {p.title}
                              </Link>
                            </li>
                          ))}
                          {s.programs.length === 0 && (
                            <li className="text-body-md text-on-surface-variant/70">Coming soon</li>
                          )}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-2 border-t border-outline-variant/30 pt-4 lg:col-span-4">
                      <Link
                        to="/programs"
                        className="inline-flex items-center gap-2 text-button text-secondary"
                      >
                        View all programmes
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/programs"
              className="label-caps text-on-surface-variant transition-colors hover:text-secondary"
              activeProps={{ className: "label-caps text-secondary border-b-2 border-secondary pb-1" }}
            >
              Programs
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setMenu("services")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                aria-expanded={menu === "services"}
                aria-haspopup="true"
                onClick={() => setMenu(menu === "services" ? null : "services")}
                className={triggerClass(menu === "services" || pathname.startsWith("/services"))}
              >
                Services
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              {menu === "services" && (
                <div className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-6">
                  <div className="rounded-lg border border-outline-variant/30 bg-surface p-6 shadow-xl">
                    <ul className="space-y-4">
                      {SERVICES.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to="/services"
                            hash={s.slug}
                            className="block font-display text-title-lg text-primary transition-colors hover:text-secondary"
                          >
                            {s.name}
                          </Link>
                          <p className="mt-1 text-body-md text-on-surface-variant">
                            {s.name === "Readers Community Library"
                              ? "Community reading and study space."
                              : "Field trips across the Western block."}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="label-caps text-on-surface-variant transition-colors hover:text-secondary"
              activeProps={{ className: "label-caps text-secondary border-b-2 border-secondary pb-1" }}
            >
              Contact
            </Link>
          </nav>
        </div>

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
        <div className="max-h-[75vh] overflow-y-auto border-t border-outline-variant/20 bg-surface px-margin-mobile pb-6 pt-2 md:hidden">
          <nav className="flex flex-col">
            {NAV.filter((i) => i.to !== "/contact").map((item) => (
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

            <button
              type="button"
              onClick={() => setMobileSection(mobileSection === "schools" ? null : "schools")}
              className="label-caps flex items-center justify-between border-b border-outline-variant/20 py-4 text-left text-on-surface-variant"
              aria-expanded={mobileSection === "schools"}
            >
              Schools
              <span className="material-symbols-outlined text-[20px]">
                {mobileSection === "schools" ? "expand_less" : "expand_more"}
              </span>
            </button>
            {mobileSection === "schools" && (
              <div className="border-b border-outline-variant/20 py-4 pl-3">
                {SCHOOL_LIST.map((s) => (
                  <div key={s.slug} className="mb-4">
                    <Link
                      to="/schools"
                      hash={s.slug}
                      onClick={() => setOpen(false)}
                      className="block font-display text-title-lg text-primary"
                    >
                      {s.short}
                    </Link>
                    <ul className="mt-1 space-y-1">
                      {s.programs.map((p) => (
                        <li key={p.title}>
                          <Link
                            to="/programs"
                            onClick={() => setOpen(false)}
                            className="text-body-md text-on-surface-variant"
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileSection(mobileSection === "services" ? null : "services")}
              className="label-caps flex items-center justify-between border-b border-outline-variant/20 py-4 text-left text-on-surface-variant"
              aria-expanded={mobileSection === "services"}
            >
              Services
              <span className="material-symbols-outlined text-[20px]">
                {mobileSection === "services" ? "expand_less" : "expand_more"}
              </span>
            </button>
            {mobileSection === "services" && (
              <div className="border-b border-outline-variant/20 py-4 pl-3">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services"
                    hash={s.slug}
                    onClick={() => setOpen(false)}
                    className="mb-3 block font-display text-title-lg text-primary"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="label-caps border-b border-outline-variant/20 py-4 text-on-surface-variant"
              activeProps={{ className: "label-caps py-4 text-secondary border-b border-outline-variant/20" }}
            >
              Contact
            </Link>

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
