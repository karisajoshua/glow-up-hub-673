import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { MASTERCLASS } from "@/lib/masterclass";
import {
  confirmMasterclassPayment,
  setMasterclassMeetLink,
} from "@/lib/masterclass-admin.functions";

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
  payment_status: string | null;
  paid_at: string | null;
  confirmation_email_sent_at: string | null;
};

const MASTERCLASS_LABELS: Record<string, string> = {
  "green-job-readiness": "Green Job Readiness",
  "digital-career-compass": "Digital Career Compass",
};

const MASTERCLASS_KEYS = ["green-job-readiness", "digital-career-compass"] as const;

function masterclassLabel(key: string | null) {
  return (key && MASTERCLASS_LABELS[key]) || "Green Job Readiness";
}

const ROW_SELECT =
  "id, masterclass, full_name, phone, email, occupation, heard_about, created_at, payment_status, paid_at, confirmation_email_sent_at";

function AdminMasterclass() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [masterclassFilter, setMasterclassFilter] = useState<"all" | string>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "paid">("all");
  const [links, setLinks] = useState<Record<string, string>>({});
  const [linkSaving, setLinkSaving] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const saveLink = useServerFn(setMasterclassMeetLink);
  const confirmPayment = useServerFn(confirmMasterclassPayment);

  async function loadRows() {
    const { data } = await supabase
      .from("masterclass_registrations")
      .select(ROW_SELECT)
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
  }

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
      await loadRows();
      const { data: sessions } = await supabase
        .from("masterclass_sessions")
        .select("masterclass, meet_link");
      const next: Record<string, string> = {};
      for (const key of MASTERCLASS_KEYS) next[key] = "";
      for (const s of sessions ?? []) next[s.masterclass] = s.meet_link ?? "";
      setLinks(next);
    })();
  }, []);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (masterclassFilter === "all" ||
            (r.masterclass ?? "green-job-readiness") === masterclassFilter) &&
          (paymentFilter === "all" || (r.payment_status ?? "pending") === paymentFilter) &&
          `${r.full_name} ${r.email} ${r.phone} ${r.occupation}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [rows, search, masterclassFilter, paymentFilter],
  );

  const thisWeek = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff).length;
  }, [rows]);

  const paidCount = useMemo(
    () => rows.filter((r) => (r.payment_status ?? "pending") === "paid").length,
    [rows],
  );

  async function handleSaveLink(key: string) {
    setLinkSaving(key);
    setNotice(null);
    try {
      const result = await saveLink({
        data: { masterclass: key as (typeof MASTERCLASS_KEYS)[number], meet_link: links[key] ?? "" },
      });
      setNotice(
        result.ok
          ? { tone: "ok", text: `Joining link saved for ${masterclassLabel(key)}.` }
          : { tone: "error", text: result.error },
      );
    } catch {
      setNotice({ tone: "error", text: "Could not save the link. Please try again." });
    } finally {
      setLinkSaving(null);
    }
  }

  async function handleConfirm(row: Row, resend: boolean) {
    setBusyId(row.id);
    setNotice(null);
    try {
      const result = await confirmPayment({ data: { id: row.id, resend } });
      if (!result.ok) {
        setNotice({ tone: "error", text: result.error });
      } else {
        await loadRows();
        setNotice({
          tone: result.emailSent ? "ok" : "error",
          text: result.emailSent
            ? `${row.full_name} is marked as paid and the joining link was emailed to ${row.email}.`
            : `${row.full_name} is marked as paid, but the email could not be sent: ${result.emailNote ?? "unknown reason"}`,
        });
      }
    } catch {
      setNotice({ tone: "error", text: "Something went wrong. Please try again." });
    } finally {
      setBusyId(null);
    }
  }

  function exportCsv() {
    const header = [
      "Name",
      "Phone",
      "Email",
      "Occupation",
      "Masterclass",
      "Payment",
      "Paid on",
      "Email sent",
      "Heard about",
      "Registered",
    ];
    const lines = filtered.map((r) =>
      [
        r.full_name,
        r.phone,
        r.email,
        r.occupation,
        masterclassLabel(r.masterclass),
        (r.payment_status ?? "pending") === "paid" ? "Paid" : "Pending payment",
        r.paid_at ?? "",
        r.confirmation_email_sent_at ?? "",
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
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Stat label="Total registrations" value={rows.length} />
        <Stat label="Paid" value={paidCount} />
        <Stat label="New this week" value={thisWeek} />
        <Stat label="Investment" value={MASTERCLASS.fee} />
      </div>

      <div className="mb-8 rounded-lg border border-outline-variant/20 bg-surface p-6">
        <h2 className="mb-1 font-display text-headline-sm text-primary">Joining links</h2>
        <p className="mb-5 text-body-sm text-on-surface-variant">
          Paste the Google Meet link for each masterclass. It is included in the confirmation email
          sent when you mark a payment as paid.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {MASTERCLASS_KEYS.map((key) => (
            <div key={key}>
              <label className="label-caps mb-2 block text-on-surface-variant" htmlFor={`link-${key}`}>
                {masterclassLabel(key)}
              </label>
              <div className="flex gap-2">
                <input
                  id={`link-${key}`}
                  value={links[key] ?? ""}
                  onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  className="flex-1 rounded-md border border-outline-variant/50 bg-surface px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveLink(key)}
                  disabled={linkSaving === key}
                  className="rounded-md bg-primary px-5 py-2.5 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  {linkSaving === key ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {notice && (
        <div
          className={`mb-6 rounded-md border-l-2 p-4 text-body-sm ${
            notice.tone === "ok"
              ? "border-secondary bg-secondary/10 text-on-surface"
              : "border-error bg-error/10 text-on-surface"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone or role"
          className="min-w-[260px] flex-1 rounded-md border border-outline-variant/50 bg-surface px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:outline-none"
        />
        <select
          value={masterclassFilter}
          onChange={(e) => setMasterclassFilter(e.target.value)}
          className="rounded-md border border-outline-variant/50 bg-surface px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:outline-none"
        >
          <option value="all">All masterclasses</option>
          <option value="green-job-readiness">Green Job Readiness</option>
          <option value="digital-career-compass">Digital Career Compass</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as "all" | "pending" | "paid")}
          className="rounded-md border border-outline-variant/50 bg-surface px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:outline-none"
        >
          <option value="all">All payments</option>
          <option value="pending">Pending payment</option>
          <option value="paid">Paid</option>
        </select>
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
              <Th>Masterclass</Th>
              <Th>Payment</Th>
              <Th>Registered</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const paid = (r.payment_status ?? "pending") === "paid";
              return (
                <tr key={r.id} className="border-b border-outline-variant/10 last:border-0">
                  <Td>{r.full_name}</Td>
                  <Td>{r.phone}</Td>
                  <Td>{r.email}</Td>
                  <Td>{r.occupation}</Td>
                  <Td>{masterclassLabel(r.masterclass)}</Td>
                  <Td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-body-sm ${
                        paid
                          ? "bg-secondary/15 text-secondary"
                          : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {paid ? "Paid" : "Pending payment"}
                    </span>
                    {paid && (
                      <span className="mt-1 block text-body-sm text-on-surface-variant">
                        {r.confirmation_email_sent_at ? "Email sent" : "Email not sent"}
                      </span>
                    )}
                  </Td>
                  <Td>{new Date(r.created_at).toLocaleDateString("en-KE")}</Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => handleConfirm(r, paid)}
                      disabled={busyId === r.id}
                      className="rounded-md border border-secondary px-4 py-2 text-button text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-60"
                    >
                      {busyId === r.id ? "Working…" : paid ? "Resend email" : "Mark as paid"}
                    </button>
                  </Td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-on-surface-variant">
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
