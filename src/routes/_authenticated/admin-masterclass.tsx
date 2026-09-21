import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { MASTERCLASS } from "@/lib/masterclass";

export const Route = createFileRoute("/_authenticated/admin-masterclass")({
  head: () => ({
    meta: [
      { title: "Masterclass Registrations | S-STC Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminMasterclass,
});

type Row = {
  id: string;
  masterclass: string | null;
  full_name: string;
  phone: string;
  email: string;
  occupation: string;
  heard_about: string | null;
  created_at: string;
};

const MASTERCLASS_LABELS: Record<string, string> = {
  "green-job-readiness": "Green Job Readiness",
  "digital-career-compass": "Digital Career Compass",
};

function masterclassLabel(key: string | null) {
  return (key && MASTERCLASS_LABELS[key]) || "Green Job Readiness";
}

function AdminMasterclass() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [masterclassFilter, setMasterclassFilter] = useState<"all" | string>("all");

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
        .from("masterclass_registrations")
        .select("id, masterclass, full_name, phone, email, occupation, heard_about, created_at")
        .order("created_at", { ascending: false });
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (masterclassFilter === "all" || (r.masterclass ?? "green-job-readiness") === masterclassFilter) &&
          `${r.full_name} ${r.email} ${r.phone} ${r.occupation}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [rows, search, masterclassFilter],
  );

  const thisWeek = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff).length;
  }, [rows]);

  function exportCsv() {
    const header = ["Name", "Phone", "Email", "Occupation", "Masterclass", "Heard about", "Registered"];
    const lines = filtered.map((r) =>
      [
        r.full_name,
        r.phone,
        r.email,
        r.occupation,
        masterclassLabel(r.masterclass),
        r.heard_about ?? "",
        r.created_at,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "masterclass-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (isAdmin === false) {
    return (
      <AdminShell title="Masterclass registrations">
        <p className="text-body-md text-on-surface-variant">
          You do not have access to this area.
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Masterclass registrations" subtitle={MASTERCLASS.title}>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Stat label="Total registrations" value={rows.length} />
        <Stat label="New this week" value={thisWeek} />
        <Stat label="Investment" value={MASTERCLASS.fee} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone or role"
          className="min-w-[260px] flex-1 rounded-md border border-outline-variant/50 bg-surface px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:outline-none"
        />
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-md border border-secondary px-5 py-2.5 text-button text-secondary transition-colors hover:bg-secondary/10"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-outline-variant/20 bg-surface">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-outline-variant/20 text-on-surface-variant">
            <tr>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
              <Th>Occupation</Th>
              <Th>Heard about</Th>
              <Th>Registered</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-outline-variant/10 last:border-0">
                <Td>{r.full_name}</Td>
                <Td>{r.phone}</Td>
                <Td>{r.email}</Td>
                <Td>{r.occupation}</Td>
                <Td>{r.heard_about ?? "—"}</Td>
                <Td>{new Date(r.created_at).toLocaleDateString("en-KE")}</Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-on-surface-variant">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface p-6">
      <p className="label-caps mb-2 text-on-surface-variant">{label}</p>
      <p className="font-display text-headline-md text-primary">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-on-surface">{children}</td>;
}
