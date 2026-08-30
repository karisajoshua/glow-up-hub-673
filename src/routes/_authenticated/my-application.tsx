import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { DOC_TYPES, STATUS_LABELS, type EducationRow } from "@/lib/application-options";
import { sectionStatuses } from "@/lib/application-progress";

export const Route = createFileRoute("/_authenticated/my-application")({
  head: () => ({
    meta: [{ title: "My Application | S-STC" }, { name: "robots", content: "noindex" }],
  }),
  component: MyApplication,
});

type AppRow = {
  id: string;
  status: string;
  reference_no: string | null;
  submitted_at: string | null;
  school: string | null;
  course: string | null;
  mode_of_study: string | null;
  preferred_intake: string | null;
  full_name: string | null;
  email: string | null;
  admin_note: string | null;
  education: unknown;
  [key: string]: unknown;
};

function MyApplication() {
  const [row, setRow] = useState<AppRow | null>(null);
  const [docs, setDocs] = useState<{ id: string; doc_type: string; file_name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setRow(data as AppRow | null);
      if (data) {
        const { data: docRows } = await supabase
          .from("application_documents")
          .select("id, doc_type, file_name")
          .eq("application_id", data.id);
        setDocs(docRows ?? []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <div className="container-max px-margin-mobile md:px-margin-desktop">
          <h1 className="mb-8 font-display text-display-lg text-primary">My Application</h1>

          {loading && <p className="text-body-md text-on-surface-variant">Loading…</p>}

          {!loading && !row && (
            <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
              <p className="mb-6 text-body-lg text-on-surface">You have not started an application yet.</p>
              <Link
                to="/application"
                search={{}}
                className="inline-flex rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary"
              >
                Start your application
              </Link>
            </div>
          )}

          {!loading && row && (
            <div className="grid gap-gutter md:grid-cols-3">
              <div className="space-y-6 md:col-span-2">
                <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                  <p className="label-caps mb-2 text-on-surface-variant">Status</p>
                  <p className="mb-6 font-display text-headline-md text-primary">
                    {STATUS_LABELS[row.status] ?? row.status}
                  </p>
                  <dl className="grid gap-4 md:grid-cols-2">
                    <Item label="Reference number" value={row.reference_no ?? "Issued at submission"} />
                    <Item
                      label="Submitted"
                      value={row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : "Not yet submitted"}
                    />
                    <Item label="School" value={row.school} />
                    <Item label="Course" value={row.course} />
                    <Item label="Mode of study" value={row.mode_of_study} />
                    <Item label="Preferred intake" value={row.preferred_intake} />
                  </dl>
                  {row.status === "draft" && (
                    <Link
                      to="/application"
                      search={{}}
                      className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary"
                    >
                      Continue your application
                    </Link>
                  )}
                </div>

                {row.status === "draft" && (
                  <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                    <p className="label-caps mb-2 text-on-surface-variant">Sections to complete</p>
                    <p className="mb-6 text-body-sm text-on-surface-variant">
                      {sections.filter((s) => s.complete).length} of {sections.length} sections complete.
                      You can jump straight back into any unfinished section.
                    </p>
                    <ul className="divide-y divide-outline-variant/20">
                      {sections.map((section) => (
                        <li key={section.label} className="flex items-center justify-between gap-4 py-3">
                          <span className="flex items-center gap-3 text-body-md text-on-surface">
                            <span
                              className={`material-symbols-outlined text-xl ${
                                section.complete ? "text-secondary" : "text-on-surface-variant"
                              }`}
                            >
                              {section.complete ? "check_circle" : "radio_button_unchecked"}
                            </span>
                            {section.index + 1}. {section.label}
                          </span>
                          {section.complete ? (
                            <Link
                              to="/application"
                              search={{ step: section.index }}
                              className="text-body-sm text-on-surface-variant hover:underline"
                            >
                              Review
                            </Link>
                          ) : (
                            <Link
                              to="/application"
                              search={{ step: section.index }}
                              className="text-body-sm font-medium text-secondary hover:underline"
                            >
                              Finish this section
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


                <div className="rounded-lg border-l-2 border-secondary bg-surface-container-low p-8">
                  <p className="label-caps mb-3 text-on-surface-variant">Next steps from admissions</p>
                  <p className="whitespace-pre-line text-body-md text-on-surface">
                    {row.admin_note?.trim()
                      ? row.admin_note
                      : "No update yet. Admissions will post payment details and your start date here once your application has been reviewed."}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
                <p className="label-caps mb-4 text-on-surface-variant">Your documents</p>
                <ul className="space-y-3 text-body-sm text-on-surface">
                  {DOC_TYPES.map((type) => {
                    const files = docs.filter((d) => d.doc_type === type.key);
                    return (
                      <li key={type.key}>
                        <span className="block text-on-surface-variant">{type.label}</span>
                        {files.length ? (
                          files.map((f) => <span key={f.id} className="block">{f.file_name}</span>)
                        ) : (
                          <span className="block italic text-on-surface-variant">Not uploaded</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-6 text-body-sm text-on-surface-variant">
                  Questions? Email{" "}
                  <a className="text-secondary hover:underline" href="mailto:admissions@sstc.co.ke">
                    admissions@sstc.co.ke
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Item({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="label-caps text-on-surface-variant">{label}</dt>
      <dd className="text-body-md text-on-surface">{value ?? "—"}</dd>
    </div>
  );
}
