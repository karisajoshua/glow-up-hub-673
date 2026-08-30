import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_STATUSES, DOC_TYPES, STATUS_LABELS, type EducationRow } from "@/lib/application-options";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({
    meta: [{ title: "Application Detail | S-STC Admissions" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminApplicationDetail,
});

const SECTIONS: { title: string; fields: [string, string][] }[] = [
  {
    title: "School & course",
    fields: [
      ["school", "School / training centre"],
      ["school_other", "School (other)"],
      ["course", "Course"],
      ["mode_of_study", "Mode of study"],
      ["mode_of_study_other", "Mode (other)"],
      ["preferred_intake", "Preferred intake"],
    ],
  },
  {
    title: "Personal information",
    fields: [
      ["full_name", "Full name"],
      ["date_of_birth", "Date of birth"],
      ["gender", "Gender"],
      ["nationality", "Nationality"],
      ["id_number", "ID / passport"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["residential_address", "Residential address"],
      ["county", "County"],
      ["sub_county", "Sub-county"],
      ["town", "Town"],
      ["postal_code", "Postal code"],
    ],
  },
  {
    title: "Employment",
    fields: [
      ["employment_status", "Employment status"],
      ["employer_name", "Employer"],
      ["occupation", "Occupation"],
      ["work_experience_years", "Years of experience"],
    ],
  },
  {
    title: "Emergency contact",
    fields: [
      ["emergency_name", "Name"],
      ["emergency_relationship", "Relationship"],
      ["emergency_phone", "Phone"],
      ["emergency_email", "Email"],
      ["emergency_address", "Address"],
    ],
  },
  {
    title: "Referral & declaration",
    fields: [
      ["heard_about", "Heard about us via"],
      ["heard_about_other", "Referral (other)"],
      ["signature_name", "Signature"],
    ],
  },
];

function AdminApplicationDetail() {
  const { id } = useParams({ from: "/_authenticated/admin/$id" });
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [docs, setDocs] = useState<{ id: string; doc_type: string; file_name: string; storage_path: string }[]>([]);
  const [status, setStatus] = useState("submitted");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        setDenied(true);
        return;
      }
      setRow(data as Record<string, unknown>);
      setStatus(String(data.status));
      setNote(data.admin_note ?? "");
      const { data: docRows } = await supabase
        .from("application_documents")
        .select("id, doc_type, file_name, storage_path")
        .eq("application_id", id);
      setDocs(docRows ?? []);
    })();
  }, [id]);

  async function save() {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("applications")
      .update({
        status: status as never,
        admin_note: note,
        reviewed_by: userData.user?.id ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Application updated. The applicant can now see this.");
  }

  async function openDoc(path: string) {
    const { data, error } = await supabase.storage
      .from("application-documents")
      .createSignedUrl(path, 60 * 10);
    if (error || !data) {
      toast.error(error?.message ?? "Could not open the file.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  const education = Array.isArray(row?.["education"]) ? (row["education"] as EducationRow[]) : [];

  return (
    <AdminShell active="applications" title="Application review">
      <div>
          <Link to="/admin" className="mb-6 inline-block text-body-sm text-secondary hover:underline">
            &larr; Back to dashboard
          </Link>

          {denied && (
            <p className="text-body-md text-on-surface-variant">
              This application is not available to your account.
            </p>
          )}

          {row && (
            <>
              <h1 className="mb-2 font-display text-display-lg text-primary">
                {String(row["full_name"] ?? "Application")}
              </h1>
              <p className="mb-10 text-body-md text-on-surface-variant">
                {String(row["reference_no"] ?? "No reference yet")} ·{" "}
                {STATUS_LABELS[String(row["status"])] ?? String(row["status"])}
              </p>

              <div className="grid gap-gutter lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  {SECTIONS.map((section) => (
                    <div key={section.title} className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                      <h2 className="mb-6 font-display text-headline-md text-primary">{section.title}</h2>
                      <dl className="grid gap-4 md:grid-cols-2">
                        {section.fields.map(([key, label]) => (
                          <div key={key}>
                            <dt className="label-caps text-on-surface-variant">{label}</dt>
                            <dd className="text-body-md text-on-surface">
                              {row[key] ? String(row[key]) : "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}

                  <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                    <h2 className="mb-6 font-display text-headline-md text-primary">Education</h2>
                    {!education.length && <p className="text-body-md text-on-surface-variant">Not provided.</p>}
                    <ul className="space-y-4">
                      {education.map((entry, i) => (
                        <li key={i} className="rounded-md bg-surface-container-low p-4 text-body-md text-on-surface">
                          <span className="label-caps block text-on-surface-variant">{entry.level}</span>
                          {entry.institution} · {entry.year_from}–{entry.year_to} · {entry.qualification}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                    <h2 className="mb-4 font-display text-headline-md text-primary">Review</h2>
                    <label className="mb-4 block">
                      <span className="label-caps mb-2 block text-on-surface-variant">Status</span>
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
                        {ADMIN_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mb-4 block">
                      <span className="label-caps mb-2 block text-on-surface-variant">
                        Next steps for the applicant
                      </span>
                      <textarea
                        rows={7}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Payment details, start date, documents still required…"
                        className="form-input"
                      />
                    </label>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void save()}
                      className="w-full rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save review"}
                    </button>
                    {Boolean(row["email"]) && (
                      <a
                        href={`mailto:${String(row["email"])}?subject=${encodeURIComponent(
                          `S-STC application ${String(row["reference_no"] ?? "")}`,
                        )}`}
                        className="mt-4 block text-center text-body-sm text-secondary hover:underline"
                      >
                        Email {String(row["email"])}
                      </a>
                    )}
                  </div>

                  <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                    <h2 className="mb-4 font-display text-headline-md text-primary">Documents</h2>
                    <ul className="space-y-4 text-body-sm">
                      {DOC_TYPES.map((type) => {
                        const files = docs.filter((d) => d.doc_type === type.key);
                        return (
                          <li key={type.key}>
                            <span className="label-caps block text-on-surface-variant">{type.label}</span>
                            {files.length ? (
                              files.map((f) => (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => void openDoc(f.storage_path)}
                                  className="block text-left text-secondary hover:underline"
                                >
                                  {f.file_name}
                                </button>
                              ))
                            ) : (
                              <span className="italic text-on-surface-variant">Not uploaded</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
      </div>

    </AdminShell>
  );
}
