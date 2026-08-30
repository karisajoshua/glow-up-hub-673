import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminShell, type AdminSection } from "@/components/admin/AdminShell";
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

const CHART_COLORS = [
  "var(--color-secondary)",
  "var(--color-primary)",
  "var(--color-tertiary, var(--color-secondary))",
  "var(--color-on-surface-variant)",
  "var(--color-outline, var(--color-on-surface-variant))",
];

function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [school, setSchool] = useState("");
  const [status, setStatus] = useState("");
  const [section, setSection] = useState<AdminSection>("overview");

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
  const drafts = useMemo(() => rows.filter((r) => r.status === "draft").length, [rows]);

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

  const trend = useMemo(() => {
    const weeks: { label: string; applications: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      const count = submitted.filter((r) => {
        const t = new Date(r.submitted_at ?? r.created_at).getTime();
        return t > start.getTime() && t <= end.getTime();
      }).length;
      weeks.push({
        label: end.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        applications: count,
      });
    }
    return weeks;
  }, [submitted]);

  const statusData = useMemo(
    () =>
      Object.entries(byStatus).map(([key, value]) => ({
        name: STATUS_LABELS[key] ?? key,
        value,
      })),
    [byStatus],
  );
  const schoolData = useMemo(
    () => Object.entries(bySchool).map(([name, value]) => ({ name: shorten(name), value })),
    [bySchool],
  );
  const modeData = useMemo(
    () => Object.entries(byMode).map(([name, value]) => ({ name, value })),
    [byMode],
  );

  const accepted = byStatus["accepted"] ?? 0;
  const conversion = submitted.length ? Math.round((accepted / submitted.length) * 100) : 0;

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

  if (isAdmin === null) {
    return (
      <AdminShell title="Admissions Dashboard">
        <p className="text-body-md text-on-surface-variant">Checking access…</p>
      </AdminShell>
    );
  }

  if (isAdmin === false) {
    return (
      <AdminShell title="Admissions Dashboard">
        <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
          <p className="mb-4 text-body-lg text-on-surface">
            This area is for S-STC admissions staff only.
          </p>
          <Link to="/my-application" className="text-button text-secondary hover:underline">
            Go to my application
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      active={section}
      onNavigate={setSection}
      title="Admissions Dashboard"
      subtitle={`${submitted.length} submitted applications · ${drafts} drafts in progress`}
    >
      {section === "overview" && (
        <div className="space-y-8">
          <div className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-5">
            <Stat label="Total applications" value={submitted.length} icon="description" />
            <Stat label="New this week" value={newThisWeek} icon="trending_up" />
            <Stat
              label="Awaiting review"
              value={(byStatus["submitted"] ?? 0) + (byStatus["under_review"] ?? 0)}
              icon="pending_actions"
            />
            <Stat label="Accepted" value={accepted} icon="verified" />
            <Stat label="Acceptance rate" value={`${conversion}%`} icon="percent" />
          </div>

          <Card title="Applications over the last 12 weeks">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="appsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="currentColor" className="text-on-surface-variant" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="currentColor" className="text-on-surface-variant" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="var(--color-secondary)"
                    strokeWidth={2}
                    fill="url(#appsFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid gap-gutter lg:grid-cols-2">
            <Card title="Applications by status">
              <ChartOrEmpty empty={!statusData.length}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                    {statusData.map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ChartOrEmpty>
            </Card>
            <Card title="Mode of study">
              <ChartOrEmpty empty={!modeData.length}>
                <BarChart data={modeData}>
                  <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="currentColor" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartOrEmpty>
            </Card>
          </div>
        </div>
      )}

      {section === "schools" && (
        <Card title="Applications by school">
          <ChartOrEmpty empty={!schoolData.length} height={420}>
            <BarChart data={schoolData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" allowDecimals={false} stroke="currentColor" fontSize={12} />
              <YAxis type="category" dataKey="name" width={160} stroke="currentColor" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--color-secondary)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartOrEmpty>
        </Card>
      )}

      {section === "statuses" && (
        <div className="grid gap-gutter lg:grid-cols-2">
          <Card title="Status split">
            <ChartOrEmpty empty={!statusData.length}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={110}>
                  {statusData.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ChartOrEmpty>
          </Card>
          <Card title="Status counts">
            <ul className="space-y-4">
              {ADMIN_STATUSES.map((key) => (
                <li key={key} className="flex items-center justify-between text-body-md text-on-surface">
                  <span>{STATUS_LABELS[key]}</span>
                  <span className="font-display text-title-lg text-primary">{byStatus[key] ?? 0}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {section === "applications" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-4 rounded-lg border border-outline-variant/30 bg-surface p-6">
            <label className="block min-w-[220px] flex-1">
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
                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-body-sm text-secondary">
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link to="/admin/$id" params={{ id: r.id }} className="text-secondary hover:underline">
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
        </div>
      )}
    </AdminShell>
  );
}

function shorten(name: string) {
  return name.replace("School of ", "");
}

function tally(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface p-6">
      <p className="label-caps mb-6 text-on-surface-variant">{title}</p>
      {children}
    </div>
  );
}

function ChartOrEmpty({
  empty,
  height = 300,
  children,
}: {
  empty: boolean;
  height?: number;
  children: React.ReactElement;
}) {
  if (empty) {
    return <p className="text-body-sm text-on-surface-variant">No data yet.</p>;
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="label-caps text-on-surface-variant">{label}</p>
        <span className="material-symbols-outlined text-2xl text-secondary">{icon}</span>
      </div>
      <p className="font-display text-display-lg text-primary">{value}</p>
    </div>
  );
}
