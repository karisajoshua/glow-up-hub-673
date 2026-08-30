import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "sstc-admin-sidebar-collapsed";

export type AdminSection = "overview" | "applications" | "schools" | "statuses";

const ITEMS: { key: AdminSection; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "dashboard" },
  { key: "applications", label: "Applications", icon: "table_rows" },
  { key: "schools", label: "By school", icon: "school" },
  { key: "statuses", label: "By status", icon: "donut_small" },
];

export function AdminShell({
  active,
  onNavigate,
  title,
  subtitle,
  children,
}: {
  active?: AdminSection;
  onNavigate?: (section: AdminSection) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function toggle() {
    setCollapsed((value) => {
      const next = !value;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {ITEMS.map((item) => {
        const isActive = active === item.key;
        const classes = `flex items-center gap-3 rounded-md px-3 py-3 text-body-sm transition-colors ${
          isActive
            ? "bg-secondary/15 text-secondary"
            : "text-on-surface-variant hover:bg-surface-container-low hover:text-secondary"
        }`;
        const content = (
          <>
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </>
        );
        return onNavigate ? (
          <button
            key={item.key}
            type="button"
            title={item.label}
            onClick={() => {
              onNavigate(item.key);
              setMobileOpen(false);
            }}
            className={`${classes} text-left`}
          >
            {content}
          </button>
        ) : (
          <Link key={item.key} to="/admin" title={item.label} className={classes}>
            {content}
          </Link>
        );
      })}

      <div className="mt-6 border-t border-outline-variant/20 pt-4">
        <Link
          to="/"
          title="View website"
          className="flex items-center gap-3 rounded-md px-3 py-3 text-body-sm text-on-surface-variant transition-colors hover:text-secondary"
        >
          <span className="material-symbols-outlined text-2xl">public</span>
          {!collapsed && <span>View website</span>}
        </Link>
        <button
          type="button"
          title="Sign out"
          onClick={() => void signOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-body-sm text-on-surface-variant transition-colors hover:text-secondary"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface-container-low">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-outline-variant/20 bg-surface p-4 transition-all duration-300 md:flex ${
          collapsed ? "w-[84px]" : "w-[260px]"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          {!collapsed && (
            <span className="font-display text-title-lg font-bold text-primary">S-STC Admin</span>
          )}
          <button
            type="button"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            onClick={toggle}
            className="rounded-md p-2 text-on-surface-variant transition-colors hover:text-secondary"
          >
            <span className="material-symbols-outlined text-2xl">
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>
        {nav}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-primary/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-[260px] flex-col bg-surface p-4">
            <span className="mb-8 font-display text-title-lg font-bold text-primary">S-STC Admin</span>
            {nav}
          </div>
        </div>
      )}

      <div className={`transition-all duration-300 ${collapsed ? "md:pl-[84px]" : "md:pl-[260px]"}`}>
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-outline-variant/20 bg-surface/90 px-6 py-5 backdrop-blur-xl">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="p-1 text-on-surface md:hidden"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <div>
            <h1 className="font-display text-headline-md text-primary">{title}</h1>
            {subtitle && <p className="text-body-sm text-on-surface-variant">{subtitle}</p>}
          </div>
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
