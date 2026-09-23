import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { DIGITAL_CAREER_COMPASS, MASTERCLASS } from "@/lib/masterclass";
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
  payment_provider: string | null;
  payment_reference: string | null;
  confirmation_email_sent_at: string | null;
};

const SESSIONS = [
  {
    key: "green-job-readiness",
    label: "Green Job Readiness",
    title: MASTERCLASS.title,
    date: MASTERCLASS.date,
    time: MASTERCLASS.time,
    venue: MASTERCLASS.venue,
    fee: MASTERCLASS.fee,
  },
  {
    key: "digital-career-compass",
    label: "Digital Career Compass",
    title: DIGITAL_CAREER_COMPASS.title,
    date: DIGITAL_CAREER_COMPASS.date,
    time: DIGITAL_CAREER_COMPASS.time,
    venue: DIGITAL_CAREER_COMPASS.venue,
    fee: DIGITAL_CAREER_COMPASS.fee,
  },
] as const;

type SessionKey = (typeof SESSIONS)[number]["key"];

function masterclassLabel(key: string | null) {
  return SESSIONS.find((s) => s.key === key)?.label ?? "Green Job Readiness";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ROW_SELECT =
  "id, masterclass, full_name, phone, email, occupation, heard_about, created_at, payment_status, paid_at, payment_provider, payment_reference, confirmation_email_sent_at";

function AdminMasterclass() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [masterclassFilter, setMasterclassFilter] = useState<"all" | string>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "paid">("all");
  const [links, setLinks] = useState<Record<string, string>>({});
  const [savedLinks, setSavedLinks] = useState<Record<string, string>>({});
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

  async function loadSessions() {
    const { data: sessions } = await supabase
      .from("masterclass_sessions")
      .select("masterclass, meet_link");
    const next: Record<string, string> = {};
    for (const s of SESSIONS) next[s.key] = "";
    for (const s of sessions ?? []) next[s.masterclass] = s.meet_link ?? "";
    setLinks(next);
    setSavedLinks(next);
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
      await loadSessions();
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

  const stats = useMemo(() => {
    const per: Record<string, { registered: number; pending: number; paid: number; sent: number }> =
      {};
    for (const s of SESSIONS) per[s.key] = { registered: 0, pending: 0, paid: 0, sent: 0 };
    for (const r of rows) {
      const key = r.masterclass ?? "green-job-readiness";
      const bucket = per[key];
      if (!bucket) continue;
      bucket.registered += 1;
      if ((r.payment_status ?? "pending") === "paid") bucket.paid += 1;
      else bucket.pending += 1;
      if (r.confirmation_email_sent_at) bucket.sent += 1;
    }
    return per;
  }, [rows]);

  const paidCount = useMemo(
    () => rows.filter((r) => (r.payment_status ?? "pending") === "paid").length,
    [rows],
  );

  const sentCount = useMemo(() => rows.filter((r) => r.confirmation_email_sent_at).length, [rows]);

  async function handleSaveLink(key: SessionKey) {
    setLinkSaving(key);
    setNotice(null);
    try {
      const result = await saveLink({
        data: { masterclass: key, meet_link: links[key] ?? "" },
      });
      if (result.ok) {
        setSavedLinks((prev) => ({ ...prev, [key]: links[key] ?? "" }));
        setNotice({ tone: "ok", text: `Session link saved for ${masterclassLabel(key)}.` });
      } else {
        setNotice({ tone: "error", text: result.error });
      }
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
            ? `${row.full_name} is confirmed as paid and the joining details were emailed to ${row.email}.`
            : `${row.full_name} is marked as paid, but the email was not sent: ${result.emailNote ?? "joining details had already been sent"}`,
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
      "Registered",
      "Payment status",
      "Paid on",
      "Payment method",
      "Payment reference",
      "Joining email sent",
      "Heard about",
    ];
    const lines = filtered.map((r) =>
      [
        r.full_name,
        r.phone,
        r.email,
        r.occupation,
        masterclassLabel(r.masterclass),
        r.created_at,
        (r.payment_status ?? "pending") === "paid" ? "Paid" : "Pending payment",
        r.paid_at ?? "",
        r.payment_provider ?? "",
        r.payment_reference ?? "",
        r.confirmation_email_sent_at ?? "",
        r.heard_about ?? "",
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
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total registrations" value={rows.length} />
        <Stat label="Paid" value={paidCount} />
        <Stat label="Pending payment" value={rows.length - paidCount} />
        <Stat label="Joining details sent" value={sentCount} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SESSIONS.map((s) => {
          const configured = Boolean((savedLinks[s.key] ?? "").trim());
          const stat = stats[s.key] ?? { registered: 0, pending: 0, paid: 0, sent: 0 };
          return (
            <div
              key={s.key}
              className="rounded-lg border border-outline-variant/20 bg-surface p-6"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-display text-headline-sm text-primary">{s.title}</h2>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-body-sm ${
                    configured
                      ? "bg-secondary/15 text-secondary"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {configured ? "Session link configured" : "Session link not configured"}
                </span>
              </div>
              <p className="mb-4 text-body-sm text-on-surface-variant">
                {s.date} · {s.time} · {s.venue} · {s.fee}
              </p>

              <div className="mb-5 grid grid-cols-4 gap-3 text-center">
                <MiniStat label="Registered" value={stat.registered} />
                <MiniStat label="Pending" value={stat.pending} />
                <MiniStat label="Paid" value={stat.paid} />
                <MiniStat label="Sent" value={stat.sent} />
              </div>

              <label className="label-caps mb-2 block text-on-surface-variant" htmlFor={`link-${s.key}`}>
                Google Calendar / Meet session link
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id={`link-${s.key}`}
                  value={links[s.key] ?? ""}
                  onChange={(e) => setLinks((prev) => ({ ...prev, [s.key]: e.target.value }))}
                  placeholder="https://calendar.app.google/..."
                  className="flex-1 rounded-md border border-outline-variant/50 bg-surface px-4 py-2.5 text-body-md text-on-surface focus:border-secondary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSaveLink(s.key)}
                  disabled={linkSaving === s.key}
                  className="rounded-md bg-primary px-5 py-2.5 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  {linkSaving === s.key ? "Saving…" : "Save"}
                </button>
              </div>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                One link serves every paid participant in this session. It is never shown publicly —
                it is only emailed after payment is confirmed.
              </p>
            </div>
          );
        })}
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
          {SESSIONS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
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
              <Th>Participant</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Masterclass</Th>
              <Th>Registered</Th>
              <Th>Payment</Th>
              <Th>Paid on</Th>
              <Th>Joining email</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const paid = (r.payment_status ?? "pending") === "paid";
              return (
                <tr key={r.id} className="border-b border-outline-variant/10 last:border-0">
                  <Td>
                    <span className="block text-on-surface">{r.full_name}</span>
                    <span className="block text-body-sm text-on-surface-variant">
                      {r.occupation}
                    </span>
                  </Td>
                  <Td>{r.email}</Td>
                  <Td>{r.phone}</Td>
                  <Td>{masterclassLabel(r.masterclass)}</Td>
                  <Td>{formatDate(r.created_at)}</Td>
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
                    {paid && r.payment_provider && (
                      <span className="mt-1 block text-body-sm text-on-surface-variant">
                        via {r.payment_provider === "manual" ? "admin confirmation" : r.payment_provider}
                      </span>
                    )}
                  </Td>
                  <Td>{formatDate(r.paid_at)}</Td>
                  <Td>
                    {r.confirmation_email_sent_at ? (
                      <span className="text-secondary">Sent {formatDate(r.confirmation_email_sent_at)}</span>
                    ) : (
                      <span className="text-on-surface-variant">Not sent</span>
                    )}
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={() => handleConfirm(r, paid)}
                      disabled={busyId === r.id}
                      className="whitespace-nowrap rounded-md border border-secondary px-4 py-2 text-button text-secondary transition-colors hover:bg-secondary/10 disabled:opacity-60"
                    >
                      {busyId === r.id
                        ? "Working…"
                        : paid
                          ? "Resend joining details"
                          : "Mark as paid"}
                    </button>
                  </Td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-on-surface-variant">
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

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-surface-container-low p-3">
      <p className="font-display text-headline-sm text-primary">{value}</p>
      <p className="text-body-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top text-on-surface">{children}</td>;
}
