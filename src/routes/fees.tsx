import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/fees")({
  head: () => ({
    meta: [
      { title: "Fees & Support | S-STC" },
      {
        name: "description",
        content:
          "Special fees, grants and instalment payment plans designed to make S-STC sustainable practice programs accessible to dedicated professionals.",
      },
      { property: "og:title", content: "Fees & Support — S-STC" },
      {
        property: "og:description",
        content: "Special fees, grant and instalment payment plans at SustainaSpace Training Center.",
      },
    ],
  }),
  component: FeesPage,
});

const PROGRAMS = [
  "Certificate in Sustainable Professional Practice",
  "Diploma in Sustainable Professional Practice",
  "Community Based Green Skilling",
  "Not sure yet",
];

function FeesPage() {
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState(PROGRAMS[0]);
  const [sent, setSent] = useState(false);


  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-max w-full flex-grow px-margin-mobile py-section-gap pt-[160px] md:px-margin-desktop">
        <div className="mb-gutter max-w-3xl">
          <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
            Fees &amp; Support
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Special fees, grant &amp; instalment payment plan.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="space-y-12 md:col-span-7">
            <div className="border-t border-outline-variant/50 pt-8">
              <h2 className="mb-4 font-display text-headline-md text-primary">Financial Support</h2>
              <p className="mb-6 text-body-md text-on-surface-variant">
                We are committed to making our sustainable practice programs accessible. Details
                regarding our specialized fee structures and grant opportunities are designed to
                support dedicated professionals.
              </p>
              <a
                href="mailto:info@sstc.co.ke?subject=Grant%20enquiry"
                className="inline-flex items-center border-b border-secondary pb-1 text-button text-secondary transition-colors hover:text-primary"
              >
                Inquire about Grants{" "}
                <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="border-t border-outline-variant/50 pt-8">
              <h2 className="mb-4 font-display text-headline-md text-primary">Payment Plans</h2>
              <p className="text-body-md text-on-surface-variant">
                Flexible instalment plans are available to help distribute the investment in your
                education over the duration of your selected program.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container p-8 shadow-sm">
              <h2 className="mb-4 font-display text-headline-md text-primary">
                Discuss Your Options
              </h2>
              <p className="mb-8 text-body-md text-on-surface-variant">
                Connect with our admissions team to explore the fee structures and support packages
                relevant to your desired program.
              </p>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <label className="sr-only" htmlFor="fees-email">
                  Email Address
                </label>
                <input
                  id="fees-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full border-b-2 border-outline-variant bg-surface px-0 py-3 text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-secondary"
                />
                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-primary px-6 py-4 text-button text-on-primary transition-colors hover:bg-secondary"
                >
                  Request Fee Schedule
                </button>
                {sent && (
                  <p className="text-body-md text-secondary" role="status">
                    Thank you — our admissions team will send the fee schedule to {email}.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
