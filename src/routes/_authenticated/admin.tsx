import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_STATUSES, SCHOOLS, STATUS_LABELS } from "@/lib/application-options";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admissions Dashboard | S-STC" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

type Row = {
  id: string;
  reference_no: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  school: string | null;
  course: string | null;
  mode_of_study: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
};

function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [school, setSchool] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      const { data } = await supabase
        .from("applications")
        .select(
          "id, reference_no, full_name, email, phone, school, course, mode_of_study, status, submitted_at, created_at",
        )
        .order("created_at", { ascending: false });
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  const submitted = useMemo(() => rows.filter((r) => r.status !== "draft"), [rows]);

  const filtered = useMemo(
    () =>
      submitted.filter((r) => {
        const haystack = `${r.reference_no ?? ""} ${r.full_name ?? ""} ${r.email ?? ""} ${r.course ?? ""}`.toLowerCase();
        if (search && !haystack.includes(search.toLowerCase())) return false;
        if (school && r.school !== school) return false;
        if (status && r.status !== status) return false;
        return true;
      }),
    [submitted, search, school, status],
  );

  const newThisWeek = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return submitted.filter((r) => new Date(r.submitted_at ?? r.created_at).getTime() >= cutoff).length;
  }, [submitted]);

  const byStatus = useMemo(() => tally(submitted.map((r) => r.status)), [submitted]);
  const bySchool = useMemo(() => tally(submitted.map((r) => r.school ?? "Unspecified")), [submitted]);
  const byMode = useMemo(() => tally(submitted.map((r) => r.mode_of_study ?? "Unspecified")), [submitted]);

  function exportCsv() {
    const header = ["Reference", "Name", "Email", "Phone", "School", "Course", "Mode", "Status", "Submitted"];
    const lines = filtered.map((r) =>
      [
        r.reference_no ?? "",
        r.full_name ?? "",
        r.email ?? "",
        r.phone ?? "",
        r.school ?? "",
        r.course ?? "",
        r.mode_of_study ?? "",
        STATUS_LABELS[r.status] ?? r.status,
        r.submitted_at ?? "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sstc-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <div className="container-max px-margin-mobile md:px-margin-desktop">
          <h1 className="mb-8 font-display text-display-lg text-primary">Admissions Dashboard</h1>

          {isAdmin === null && <p className="text-body-md text-on-surface-variant">Checking access…</p>}

          {isAdmin === false && (
            <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
              <p className="mb-4 text-body-lg text-on-surface">
                This area is for S-STC admissions staff only.
              </p>
              <Link to="/my-application" className="text-button text-secondary hover:underline">
                Go to my application
              </Link>
            </div>
          )}

          {isAdmin && (
            <>
              <div className="mb-10 grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Total applications" value={submitted.length} />
                <Stat label="New this week" value={newThisWeek} />
                <Stat label="Awaiting review" value={(byStatus["submitted"] ?? 0) + (byStatus["under_review"] ?? 0)} />
                <Stat label="Accepted" value={byStatus["accepted"] ?? 0} />
              </div>

              <div className="mb-10 grid gap-gutter md:grid-cols-3">
                <Breakdown title="By status" data={byStatus} labels={STATUS_LABELS} total={submitted.length} />
                <Breakdown title="By school" data={bySchool} total={submitted.length} />
                <Breakdown title="By mode of study" data={byMode} total={submitted.length} />
              </div>

              <div className="mb-6 flex flex-wrap items-end gap-4">
                <label className="block flex-1 min-w-[220px]">
                  <span className="label-caps mb-2 block text-on-surface-variant">Search</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Reference, name, email or course"
                    className="form-input"
                  />
                </label>
                <label className="block">
                  <span className="label-caps mb-2 block text-on-surface-variant">School</span>
                  <select value={school} onChange={(e) => setSchool(e.target.value)} className="form-input">
                    <option value="">All schools</option>
                    {SCHOOLS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="label-caps mb-2 block text-on-surface-variant">Status</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
                    <option value="">All statuses</option>
                    {ADMIN_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="rounded-md border border-secondary px-6 py-2 text-button text-secondary transition-colors hover:bg-secondary/10"
                >
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-outline-variant/30 bg-surface">
                <table className="w-full text-left text-body-sm">
                  <thead className="border-b border-outline-variant/30">
                    <tr className="label-caps text-on-surface-variant">
                      <th className="p-4">Reference</th>
                      <th className="p-4">Applicant</th>
                      <th className="p-4">School</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Submitted</th>
                      <th className="p-4">Status</th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-outline-variant/15 last:border-0">
                        <td className="p-4 font-medium text-primary">{r.reference_no ?? "—"}</td>
                        <td className="p-4 text-on-surface">
                          {r.full_name ?? "—"}
                          <span className="block text-on-surface-variant">{r.email}</span>
                        </td>
                        <td className="p-4 text-on-surface-variant">{r.school ?? "—"}</td>
                        <td className="p-4 text-on-surface-variant">{r.course ?? "—"}</td>
                        <td className="p-4 text-on-surface-variant">
                          {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="p-4 text-on-surface">{STATUS_LABELS[r.status] ?? r.status}</td>
                        <td className="p-4">
                          <Link
                            to="/admin/$id"
                            params={{ id: r.id }}
                            className="text-secondary hover:underline"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                          No applications match these filters yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function tally(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface p-6">
      <p className="label-caps mb-2 text-on-surface-variant">{label}</p>
      <p className="font-display text-display-lg text-primary">{value}</p>
    </div>
  );
}

function Breakdown({
  title,
  data,
  labels,
  total,
}: {
  title: string;
  data: Record<string, number>;
  labels?: Record<string, string>;
  total: number;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface p-6">
      <p className="label-caps mb-4 text-on-surface-variant">{title}</p>
      {!entries.length && <p className="text-body-sm text-on-surface-variant">No data yet.</p>}
      <ul className="space-y-3">
        {entries.map(([key, count]) => (
          <li key={key}>
            <div className="mb-1 flex justify-between text-body-sm text-on-surface">
              <span>{labels?.[key] ?? key}</span>
              <span>{count}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface-container">
              <div
                className="h-1.5 rounded-full bg-secondary"
                style={{ width: `${total ? Math.round((count / total) * 100) : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
