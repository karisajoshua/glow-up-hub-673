import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { HEARD_ABOUT_OPTIONS, MASTERCLASS } from "@/lib/masterclass";
import { registerForMasterclass } from "@/lib/masterclass.functions";

type Values = {
  full_name: string;
  phone: string;
  email: string;
  occupation: string;
  heard_about: string;
};

const EMPTY: Values = { full_name: "", phone: "", email: "", occupation: "", heard_about: "" };

const BRAND_PRIMARY: [number, number, number] = [12, 61, 92];
const BRAND_SECONDARY: [number, number, number] = [46, 139, 87];

function validate(values: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (values.full_name.trim().length < 2) errors.full_name = "Please enter your full name.";
  if (!/^[+0-9 ()-]{7,20}$/.test(values.phone.trim()))
    errors.phone = "Please enter a valid phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.occupation.trim().length < 2)
    errors.occupation = "Please enter your occupation or current role.";
  return errors;
}

async function buildPdf(values: Values) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(...BRAND_PRIMARY);
  doc.rect(0, 0, width, 110, "F");
  doc.setFillColor(...BRAND_SECONDARY);
  doc.rect(0, 110, width, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("S-STC", 48, 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Sustainable Skills & Technologies Centre  |  sstc.co.ke", 48, 72);
  doc.setFontSize(9);
  doc.text("Masterclass Registration", width - 48, 52, { align: "right" });

  let y = 160;
  doc.setTextColor(...BRAND_PRIMARY);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text(MASTERCLASS.title, 48, y);

  y += 24;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.text(doc.splitTextToSize(MASTERCLASS.quote, width - 96), 48, y);

  y += 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_SECONDARY);
  doc.text("Session details", 48, y);

  const details: [string, string][] = [
    ["Date", MASTERCLASS.date],
    ["Time", MASTERCLASS.time],
    ["Venue", MASTERCLASS.venue],
    ["Investment", MASTERCLASS.fee],
    ["Facilitator", `${MASTERCLASS.facilitator.name} — ${MASTERCLASS.facilitator.role}`],
  ];

  y += 8;
  doc.setFontSize(11);
  for (const [label, value] of details) {
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BRAND_PRIMARY);
    doc.text(`${label}:`, 48, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text(doc.splitTextToSize(value, width - 200), 140, y);
  }

  y += 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_SECONDARY);
  doc.text("Applicant details", 48, y);

  const applicant: [string, string][] = [
    ["Full name", values.full_name.trim()],
    ["Phone", values.phone.trim()],
    ["Email", values.email.trim()],
    ["Occupation", values.occupation.trim()],
    ["Heard about us", values.heard_about || "—"],
    ["Submitted", new Date().toLocaleString("en-KE")],
  ];

  y += 8;
  doc.setFontSize(11);
  for (const [label, value] of applicant) {
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BRAND_PRIMARY);
    doc.text(`${label}:`, 48, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text(doc.splitTextToSize(value, width - 200), 140, y);
  }

  y += 46;
  doc.setDrawColor(...BRAND_SECONDARY);
  doc.line(48, y, width - 48, y);
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND_PRIMARY);
  doc.text("Next steps", 48, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(
    doc.splitTextToSize(
      `Send this registration to ${MASTERCLASS.facilitator.name} on WhatsApp (${MASTERCLASS.facilitator.phone}). ` +
        `You will receive payment instructions for the ${MASTERCLASS.fee} investment and the Google Meet joining link before the session.`,
      width - 96,
    ),
    48,
    y,
  );

  doc.setFillColor(...BRAND_PRIMARY);
  doc.rect(0, doc.internal.pageSize.getHeight() - 40, width, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("S-STC  |  info@sstc.co.ke  |  sstc.co.ke", 48, doc.internal.pageSize.getHeight() - 16);

  const slug = values.full_name.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "Applicant";
  return { doc, filename: `SSTC-Masterclass-${slug}.pdf` };
}

function whatsappUrl(name: string) {
  const text =
    `Hello ${MASTERCLASS.facilitator.name}, my name is ${name}. ` +
    `I have registered for the ${MASTERCLASS.title} (${MASTERCLASS.date}). ` +
    `My registration PDF has just downloaded to this device — please find it attached. ` +
    `Kindly share the payment instructions for the ${MASTERCLASS.fee} and the joining link.`;
  return `https://wa.me/${MASTERCLASS.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function MasterclassForm() {
  const register = useServerFn(registerForMasterclass);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Values | null>(null);

  async function downloadPdf(v: Values) {
    const { doc, filename } = await buildPdf(v);
    doc.save(filename);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const result = await register({ data: { ...values, heard_about: values.heard_about } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      await downloadPdf(values);
      window.open(whatsappUrl(values.full_name.trim()), "_blank", "noopener,noreferrer");
      setDone(values);
      toast.success("Registration saved and your PDF has downloaded.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-secondary/40 bg-surface-container-low p-8">
        <span className="material-symbols-outlined mb-4 block text-4xl text-secondary">
          task_alt
        </span>
        <h3 className="mb-3 font-display text-headline-md text-primary">You&apos;re registered</h3>
        <p className="mb-4 text-body-md text-on-surface-variant">
          Your branded registration PDF has downloaded and WhatsApp opened with a message ready for{" "}
          {MASTERCLASS.facilitator.name}. Attach the downloaded PDF to that chat and send it — you will
          get the {MASTERCLASS.fee} payment instructions and the Google Meet link in reply.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void downloadPdf(done)}
            className="inline-flex items-center gap-2 rounded-md border border-secondary px-5 py-2.5 text-button text-secondary transition-colors hover:bg-secondary/10"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download PDF again
          </button>
          <a
            href={whatsappUrl(done.full_name.trim())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-button text-on-primary transition-colors hover:bg-primary"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            Open WhatsApp again
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm"
      noValidate
    >
      <h3 className="mb-2 font-display text-headline-md text-primary">Apply for the masterclass</h3>
      <p className="mb-6 text-body-sm text-on-surface-variant">
        Complete these details. On submit we create your branded registration PDF and open WhatsApp so
        you can send it to {MASTERCLASS.facilitator.name}.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label="Full name"
          value={values.full_name}
          error={errors.full_name}
          onChange={(v) => setValues({ ...values, full_name: v })}
          autoComplete="name"
        />
        <Field
          label="Phone number"
          value={values.phone}
          error={errors.phone}
          onChange={(v) => setValues({ ...values, phone: v })}
          type="tel"
          autoComplete="tel"
          placeholder="+2547..."
        />
        <Field
          label="Email address"
          value={values.email}
          error={errors.email}
          onChange={(v) => setValues({ ...values, email: v })}
          type="email"
          autoComplete="email"
        />
        <Field
          label="Occupation / current role"
          value={values.occupation}
          error={errors.occupation}
          onChange={(v) => setValues({ ...values, occupation: v })}
        />
        <label className="md:col-span-2">
          <span className="label-caps mb-2 block text-on-surface-variant">
            How did you hear about the masterclass?
          </span>
          <select
            value={values.heard_about}
            onChange={(e) => setValues({ ...values, heard_about: e.target.value })}
            className="w-full rounded-md border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:border-secondary focus:outline-none"
          >
            <option value="">Select an option (optional)</option>
            {HEARD_ABOUT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
        {submitting ? "Preparing your PDF…" : "Submit & send on WhatsApp"}
      </button>
      <p className="mt-4 text-body-sm text-on-surface-variant">
        Investment {MASTERCLASS.fee}. Payment instructions are shared on WhatsApp after you send your
        registration.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block text-on-surface-variant">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:outline-none ${
          error ? "border-red-500" : "border-outline-variant/50 focus:border-secondary"
        }`}
      />
      {error && <span className="mt-1 block text-body-sm text-red-600">{error}</span>}
    </label>
  );
}
