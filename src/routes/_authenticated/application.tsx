import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import {
  COURSES,
  DOC_TYPES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  EMPTY_EDUCATION_ROW,
  GENDERS,
  HEARD_ABOUT,
  MODES_OF_STUDY,
  SCHOOLS,
  type EducationRow,
} from "@/lib/application-options";

export const Route = createFileRoute("/_authenticated/application")({
  head: () => ({
    meta: [
      { title: "Application Wizard | S-STC" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApplicationWizard,
});

type FieldKey = (typeof TEXT_FIELDS)[number];
type FormState = Partial<Record<FieldKey, string>>;

const STEPS = [
  "School",
  "Personal",
  "Education",
  "Course",
  "Employment",
  "Emergency contact",
  "Referral",
  "Documents",
  "Review",
];

const TEXT_FIELDS = [
  "school",
  "school_other",
  "full_name",
  "date_of_birth",
  "gender",
  "nationality",
  "id_number",
  "phone",
  "email",
  "residential_address",
  "county",
  "sub_county",
  "town",
  "postal_code",
  "course",
  "mode_of_study",
  "mode_of_study_other",
  "preferred_intake",
  "employment_status",
  "employer_name",
  "occupation",
  "work_experience_years",
  "emergency_name",
  "emergency_relationship",
  "emergency_phone",
  "emergency_email",
  "emergency_address",
  "heard_about",
  "heard_about_other",
  "signature_name",
] as const;

type DocRow = { id: string; doc_type: string; file_name: string; storage_path: string };

function ApplicationWizard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({} as FormState);
  const [education, setEducation] = useState<EducationRow[]>([{ ...EMPTY_EDUCATION_ROW }]);
  const [declaration, setDeclaration] = useState(false);
  const [docs, setDocs] = useState<DocRow[]>([]);

  const set = useCallback((key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }) as FormState);
  }, []);

  const loadDocs = useCallback(async (appId: string) => {
    const { data } = await supabase
      .from("application_documents")
      .select("id, doc_type, file_name, storage_path")
      .eq("application_id", appId)
      .order("created_at");
    setDocs(data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;

      const { data: existing } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        if (existing.status !== "draft") {
          navigate({ to: "/my-application" as never, replace: true });
          return;
        }
        setApplicationId(existing.id);
        const next: Record<string, string> = {};
        for (const key of TEXT_FIELDS) {
          const value = (existing as Record<string, unknown>)[key];
          next[key] = value == null ? "" : String(value);
        }
        setForm(next as FormState);
        const rows = Array.isArray(existing.education)
          ? (existing.education as unknown as EducationRow[])
          : [];
        setEducation(rows.length ? rows : [{ ...EMPTY_EDUCATION_ROW }]);
        setDeclaration(Boolean(existing.declaration_accepted));
        await loadDocs(existing.id);
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", uid)
          .maybeSingle();
        const { data: created, error } = await supabase
          .from("applications")
          .insert({
            user_id: uid,
            full_name: profile?.full_name ?? "",
            email: profile?.email ?? userData.user?.email ?? "",
            phone: profile?.phone ?? "",
          })
          .select("id, full_name, email, phone")
          .single();
        if (error) {
          toast.error(error.message);
        } else if (created) {
          setApplicationId(created.id);
          setForm({
            full_name: created.full_name ?? "",
            email: created.email ?? "",
            phone: created.phone ?? "",
          } as FormState);
        }
      }
      setLoading(false);
    })();
  }, [loadDocs, navigate]);

  const payload = useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const key of TEXT_FIELDS) {
      const value = form[key];
      out[key] = value === "" || value === undefined ? null : value;
    }
    out["education"] = education.filter((row) => row.level || row.institution || row.qualification);
    out["declaration_accepted"] = declaration;
    return out;
  }, [form, education, declaration]);

  const saveDraft = useCallback(
    async (silent = false) => {
      if (!applicationId) return false;
      setSaving(true);
      const { error } = await supabase.from("applications").update(payload as never).eq("id", applicationId);
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return false;
      }
      if (!silent) toast.success("Progress saved.");
      return true;
    },
    [applicationId, payload],
  );

  async function next() {
    const problem = validateStep(step, form, declaration);
    if (problem) {
      toast.error(problem);
      return;
    }
    await saveDraft(true);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function upload(docType: string, file: File) {
    if (!userId || !applicationId) return;
    const path = `${userId}/${applicationId}/${docType}-${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage
      .from("application-documents")
      .upload(path, file);
    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }
    const { error } = await supabase.from("application_documents").insert({
      application_id: applicationId,
      user_id: userId,
      doc_type: docType,
      file_name: file.name,
      storage_path: path,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${file.name} uploaded.`);
    await loadDocs(applicationId);
  }

  async function removeDoc(doc: DocRow) {
    await supabase.storage.from("application-documents").remove([doc.storage_path]);
    await supabase.from("application_documents").delete().eq("id", doc.id);
    if (applicationId) await loadDocs(applicationId);
  }

  async function submitApplication() {
    for (let i = 0; i < STEPS.length - 1; i++) {
      const problem = validateStep(i, form, declaration);
      if (problem) {
        setStep(i);
        toast.error(problem);
        return;
      }
    }
    if (!declaration) {
      toast.error("Please accept the declaration before submitting.");
      return;
    }
    if (!applicationId) return;
    setSaving(true);
    const { error } = await supabase
      .from("applications")
      .update({ ...payload, status: "submitted" } as never)
      .eq("id", applicationId);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Application submitted.");
    navigate({ to: "/my-application" as never });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-grow pt-[140px] text-center text-body-md text-on-surface-variant">
          Loading your application…
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <div className="container-max px-margin-mobile md:px-margin-desktop">
          <h1 className="mb-2 font-display text-display-lg text-primary">Application Form</h1>
          <p className="mb-8 text-body-md text-on-surface-variant">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}. Your answers are saved as you go.
          </p>

          <div className="mb-10 flex flex-wrap gap-2">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={`rounded-full border px-4 py-2 text-body-sm transition-colors ${
                  i === step
                    ? "border-secondary bg-secondary text-on-primary"
                    : "border-outline-variant/40 text-on-surface-variant hover:border-secondary"
                }`}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-outline-variant/30 bg-surface p-6 shadow-sm md:p-10">
            {step === 0 && (
              <Grid>
                <Select label="School / Training Centre" value={form.school ?? ""} options={SCHOOLS} onChange={(v) => set("school", v)} />
                {form.school === "Other" && (
                  <Text label="Please specify" value={form.school_other ?? ""} onChange={(v) => set("school_other", v)} />
                )}
              </Grid>
            )}

            {step === 1 && (
              <Grid>
                <Text label="Full name" value={form.full_name ?? ""} onChange={(v) => set("full_name", v)} />
                <Text label="Date of birth" type="date" value={form.date_of_birth ?? ""} onChange={(v) => set("date_of_birth", v)} />
                <Select label="Gender" value={form.gender ?? ""} options={GENDERS} onChange={(v) => set("gender", v)} />
                <Text label="Nationality" value={form.nationality ?? ""} onChange={(v) => set("nationality", v)} />
                <Text label="ID / Passport number" value={form.id_number ?? ""} onChange={(v) => set("id_number", v)} />
                <Text label="Phone number" value={form.phone ?? ""} onChange={(v) => set("phone", v)} />
                <Text label="Email address" type="email" value={form.email ?? ""} onChange={(v) => set("email", v)} />
                <Text label="Residential address" value={form.residential_address ?? ""} onChange={(v) => set("residential_address", v)} />
                <Text label="County" value={form.county ?? ""} onChange={(v) => set("county", v)} />
                <Text label="Sub-county" value={form.sub_county ?? ""} onChange={(v) => set("sub_county", v)} />
                <Text label="Town" value={form.town ?? ""} onChange={(v) => set("town", v)} />
                <Text label="Postal code" value={form.postal_code ?? ""} onChange={(v) => set("postal_code", v)} />
              </Grid>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {education.map((row, index) => (
                  <div key={index} className="rounded-md border border-outline-variant/30 p-4">
                    <Grid>
                      <Select
                        label="Level"
                        value={row.level}
                        options={EDUCATION_LEVELS}
                        onChange={(v) => updateRow(setEducation, index, "level", v)}
                      />
                      <Text
                        label="Institution"
                        value={row.institution}
                        onChange={(v) => updateRow(setEducation, index, "institution", v)}
                      />
                      <Text label="Year from" value={row.year_from} onChange={(v) => updateRow(setEducation, index, "year_from", v)} />
                      <Text label="Year to" value={row.year_to} onChange={(v) => updateRow(setEducation, index, "year_to", v)} />
                      <Text
                        label="Qualification obtained"
                        value={row.qualification}
                        onChange={(v) => updateRow(setEducation, index, "qualification", v)}
                      />
                    </Grid>
                    {education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setEducation((rows) => rows.filter((_, i) => i !== index))}
                        className="mt-4 text-body-sm text-on-surface-variant hover:text-primary"
                      >
                        Remove this entry
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEducation((rows) => [...rows, { ...EMPTY_EDUCATION_ROW }])}
                  className="rounded-md border border-secondary px-6 py-2 text-button text-secondary transition-colors hover:bg-secondary/10"
                >
                  Add another entry
                </button>
              </div>
            )}

            {step === 3 && (
              <Grid>
                <Select label="Course applied for" value={form.course ?? ""} options={COURSES} onChange={(v) => set("course", v)} />
                <Select label="Mode of study" value={form.mode_of_study ?? ""} options={MODES_OF_STUDY} onChange={(v) => set("mode_of_study", v)} />
                {form.mode_of_study === "Other" && (
                  <Text label="Please specify" value={form.mode_of_study_other ?? ""} onChange={(v) => set("mode_of_study_other", v)} />
                )}
                <Text label="Preferred intake / start date" type="date" value={form.preferred_intake ?? ""} onChange={(v) => set("preferred_intake", v)} />
              </Grid>
            )}

            {step === 4 && (
              <Grid>
                <Select label="Employment status" value={form.employment_status ?? ""} options={EMPLOYMENT_STATUSES} onChange={(v) => set("employment_status", v)} />
                <Text label="Employer / organisation" value={form.employer_name ?? ""} onChange={(v) => set("employer_name", v)} />
                <Text label="Occupation" value={form.occupation ?? ""} onChange={(v) => set("occupation", v)} />
                <Text label="Years of experience" value={form.work_experience_years ?? ""} onChange={(v) => set("work_experience_years", v)} />
              </Grid>
            )}

            {step === 5 && (
              <Grid>
                <Text label="Contact name" value={form.emergency_name ?? ""} onChange={(v) => set("emergency_name", v)} />
                <Text label="Relationship" value={form.emergency_relationship ?? ""} onChange={(v) => set("emergency_relationship", v)} />
                <Text label="Phone number" value={form.emergency_phone ?? ""} onChange={(v) => set("emergency_phone", v)} />
                <Text label="Email address" type="email" value={form.emergency_email ?? ""} onChange={(v) => set("emergency_email", v)} />
                <Text label="Address" value={form.emergency_address ?? ""} onChange={(v) => set("emergency_address", v)} />
              </Grid>
            )}

            {step === 6 && (
              <Grid>
                <Select label="How did you hear about S-STC?" value={form.heard_about ?? ""} options={HEARD_ABOUT} onChange={(v) => set("heard_about", v)} />
                {form.heard_about === "Other" && (
                  <Text label="Please specify" value={form.heard_about_other ?? ""} onChange={(v) => set("heard_about_other", v)} />
                )}
              </Grid>
            )}

            {step === 7 && (
              <div className="space-y-8">
                <p className="text-body-md text-on-surface-variant">
                  Upload clear scans or photos. Each file must be 10MB or smaller.
                </p>
                {DOC_TYPES.map((type) => (
                  <div key={type.key} className="rounded-md border border-outline-variant/30 p-4">
                    <p className="label-caps mb-3 text-on-surface-variant">{type.label}</p>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void upload(type.key, file);
                        e.target.value = "";
                      }}
                      className="text-body-sm text-on-surface"
                    />
                    <ul className="mt-3 space-y-2">
                      {docs
                        .filter((d) => d.doc_type === type.key)
                        .map((d) => (
                          <li key={d.id} className="flex items-center justify-between gap-4 text-body-sm">
                            <span className="text-on-surface">{d.file_name}</span>
                            <button
                              type="button"
                              onClick={() => void removeDoc(d)}
                              className="text-on-surface-variant hover:text-primary"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {step === 8 && (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  {TEXT_FIELDS.filter((key) => form[key]).map((key) => (
                    <div key={key} className="rounded-md bg-surface-container-low p-4">
                      <p className="label-caps text-on-surface-variant">{key.replace(/_/g, " ")}</p>
                      <p className="text-body-md text-on-surface">{form[key]}</p>
                    </div>
                  ))}
                </div>

                <Text label="Signature (type your full name)" value={form.signature_name ?? ""} onChange={(v) => set("signature_name", v)} />

                <label className="flex items-start gap-3 rounded-md border-l-2 border-secondary bg-surface-container-low p-4">
                  <input
                    type="checkbox"
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-body-md text-on-surface">
                    I declare that the information given in this application is true and complete to the
                    best of my knowledge, and I accept the S-STC terms of admission.
                  </span>
                </label>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void submitApplication()}
                  className="rounded-md bg-primary px-8 py-3 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
                >
                  {saving ? "Submitting…" : "Submit application"}
                </button>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-outline-variant/20 pt-6">
              {step > 0 && (
                <button type="button" onClick={back} className="rounded-md border border-outline-variant/40 px-6 py-2 text-button text-on-surface">
                  Back
                </button>
              )}
              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={() => void next()}
                  className="rounded-md bg-primary px-6 py-2 text-button text-on-primary transition-colors hover:bg-secondary"
                >
                  Save &amp; continue
                </button>
              )}
              <button
                type="button"
                onClick={() => void saveDraft()}
                disabled={saving}
                className="text-body-sm text-secondary hover:underline disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save and finish later"}
              </button>
              <Link to={"/my-application" as string} className="ml-auto text-body-sm text-on-surface-variant hover:underline">
                My application
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function updateRow(
  setRows: React.Dispatch<React.SetStateAction<EducationRow[]>>,
  index: number,
  key: keyof EducationRow,
  value: string,
) {
  setRows((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
}

function validateStep(step: number, form: FormState, declaration: boolean): string | null {
  const need = (key: FieldKey, label: string) => (form[key]?.trim() ? null : `${label} is required.`);
  switch (step) {
    case 0:
      return need("school", "School / training centre");
    case 1:
      return (
        need("full_name", "Full name") ??
        need("date_of_birth", "Date of birth") ??
        need("phone", "Phone number") ??
        need("email", "Email address")
      );
    case 3:
      return need("course", "Course") ?? need("mode_of_study", "Mode of study");
    case 5:
      return need("emergency_name", "Emergency contact name") ?? need("emergency_phone", "Emergency contact phone");
    case 8:
      if (!form.signature_name?.trim()) return "Please type your name as a signature.";
      if (!declaration) return "Please accept the declaration.";
      return null;
    default:
      return null;
  }
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

function Text({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block text-on-surface-variant">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="form-input" />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block text-on-surface-variant">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input">
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
