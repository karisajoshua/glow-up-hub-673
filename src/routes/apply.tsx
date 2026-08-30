import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const FORM_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCv4xoynm2HWOWGd3MN1PAab_aZvYxaFkbKjsFk-KieptMWP1ANSiJo5PRJmQOZmoigwU4uzAKzycpB_lnSBVRlV5sWggOJGGvimP5W3ANdDORsjtCFbU2zONGjbSGbdfGtVGXMf5I3J6ov0awHvd6J-D0eIKGq7cXAC8-br4qh1t5pRPaGh-gWvpyr1_LdrkMAPkVAc2cBlRg-wpBWZ7SGHvN9oHth0a_mUjAXjiAd6nMvhbOyspPI";
const SUBMIT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-G4Prqr8V6Y4Xv0-B6X1zIJqmyMm7DQFkKPGOTdd7V4uv9Ic86F54BD5CexQcp6qWn0wsWY9dEPEnGU9JHWM9stZ3Fo644I7K-7VI_URp475XsE4h3lcvE8oyybd203C9XUiCJGB80dZcSoU7pAdhAndLROBvew_bMH1-V0C9mMiSe4Wu6L0lom673Ok7afqjVTbX1B8PrFrluuxow0JHzS9uqLh6wsHxL40YXg9eHp11m2AS5WYM";
const OFFER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA4-3moEUf-7E04T4E36XZJAVBofy0qxuBRpgpRRehqvv4XTmz0KMWD0P6sPO8ZYFJKtRVZYEWcrIrpNZ2qfjDF-mHPekRLJO1vPQQZmfbW3SZ6Rax9g0ZWw3TMiuLRe3JpAxcfJANp0jM4CkGFLsw3lMfIoDS4fiRGx04Z-ysmbcbzVATUFpDZUcRPoqoK7RcHMyb9ZVuumXiouFKrB2z4FiknY5RCE8-liN8R9OIZw_gJBDsJGOkI";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "How to Apply | S-STC Admissions" },
      {
        name: "description",
        content:
          "Three steps to join S-STC: request the application form, email it to admissions, and get your outcome within two weeks. Rolling intake.",
      },
      { property: "og:title", content: "How to Apply — S-STC" },
      {
        property: "og:description",
        content:
          "Download the S-STC application form, submit it to admissions and receive an outcome within 14 days.",
      },
      { property: "og:image", content: FORM_IMG },
      { name: "twitter:image", content: FORM_IMG },
      { property: "og:url", content: "https://sstc.co.ke/apply" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "How to Apply \u2014 S-STC" },
      { name: "twitter:description", content: "Three steps to join S-STC: request the application form, email it to admissions, and get your outcome within two weeks. Rolling intake." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/apply" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sstc.co.ke/"}, {"@type": "ListItem", "position": 2, "name": "How to Apply", "item": "https://sstc.co.ke/apply"}]}),
      },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <header className="container-max mb-16 px-margin-mobile md:mb-24 md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            <div className="md:col-span-8">
              <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
                How to Apply
              </h1>
              <div className="max-w-2xl rounded-lg border border-outline-variant/30 bg-surface-container-low p-8">
                <p className="mb-6 text-body-lg text-on-surface">
                  Applications are completed online. Create your applicant account, work through the
                  guided form at your own pace, and submit when you are ready — admissions replies with
                  payment details and your start date.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary"
                  >
                    Start your application
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                  <Link
                    to="/programs"
                    className="group inline-flex items-center gap-2 text-button text-secondary transition-colors hover:text-primary"
                  >
                    View Catalogue
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="container-max relative px-margin-mobile md:px-margin-desktop">
          <div className="relative py-12">
            <div className="absolute inset-y-0 left-7 w-px bg-outline-variant/50 md:left-1/2" />

            {/* Step 01 */}
            <div className="relative z-10 mb-24 flex flex-col items-start md:mb-32 md:flex-row md:items-center">
              <div className="order-2 mt-4 pl-16 md:order-1 md:mt-0 md:w-1/2 md:pl-0 md:pr-16 md:text-right">
                <div className="rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm transition-shadow hover:shadow-md">
                  <h2 className="mb-4 font-display text-headline-md text-primary">
                    Create Your Account
                  </h2>
                  <p className="text-body-md text-on-surface-variant">
                    Sign up with your email to open your applicant account. You can save your progress
                    and come back at any time before submitting.
                  </p>
                  <Link
                    to="/auth"
                    className="mt-6 inline-flex items-center gap-2 rounded-md border border-secondary px-6 py-2 text-button text-secondary transition-colors hover:bg-secondary/10"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Create Account
                  </Link>
                </div>
              </div>
              <StepNode n="01" />
              <div className="order-3 hidden md:block md:w-1/2">
                <div className="pl-16">
                  <img
                    loading="lazy"
                    className="h-64 w-full rounded-lg border border-outline-variant/20 object-cover shadow-sm"
                    alt="Application forms on a clean academic desk with a small plant"
                    src={FORM_IMG}
                  />
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative z-10 mb-24 flex flex-col items-start md:mb-32 md:flex-row md:items-center">
              <div className="order-1 hidden text-right md:block md:w-1/2 md:pr-16">
                <div className="pr-16">
                  <img
                    loading="lazy"
                    className="h-64 w-full rounded-lg border border-outline-variant/20 object-cover shadow-sm"
                    alt="Hands typing on a slim laptop keyboard"
                    src={SUBMIT_IMG}
                  />
                </div>
              </div>
              <StepNode n="02" />
              <div className="order-2 mt-4 pl-16 md:order-3 md:mt-0 md:w-1/2">
                <div className="rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm transition-shadow hover:shadow-md">
                  <h2 className="mb-4 font-display text-headline-md text-primary">
                    Complete &amp; Submit Online
                  </h2>
                  <p className="text-body-md text-on-surface-variant">
                    Complete the guided wizard — personal details, education history, course choice and
                    document uploads — then submit. You receive a reference number instantly.
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-button text-secondary">
                    <span className="material-symbols-outlined">mail</span>
                    <a className="hover:underline" href="mailto:admissions@sstc.co.ke">
                      admissions@sstc.co.ke
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative z-10 flex flex-col items-start md:flex-row md:items-center">
              <div className="order-2 mt-4 pl-16 md:order-1 md:mt-0 md:w-1/2 md:pl-0 md:pr-16 md:text-right">
                <div className="rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm transition-shadow hover:shadow-md">
                  <h2 className="mb-4 font-display text-headline-md text-primary">
                    Review &amp; Next Steps
                  </h2>
                  <p className="mb-6 text-body-md text-on-surface-variant">
                    Admissions reviews your application and posts the outcome, payment details and your
                    start date to your account. You are notified within two weeks.
                  </p>
                  <div className="flex gap-4 rounded-md border-l-2 border-secondary bg-surface-container-low p-4 text-left">
                    <span className="material-symbols-outlined mt-1 text-secondary">schedule</span>
                    <div>
                      <p className="label-caps mb-1 text-on-surface-variant">Processing Time</p>
                      <p className="font-display text-headline-md text-primary">14 Days</p>
                    </div>
                  </div>
                </div>
              </div>
              <StepNode n="03" />
              <div className="order-3 hidden md:block md:w-1/2">
                <div className="pl-16">
                  <img
                    loading="lazy"
                    className="h-64 w-full rounded-lg border border-outline-variant/20 object-cover shadow-sm"
                    alt="A premium envelope revealing an official letterhead"
                    src={OFFER_IMG}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <span className="label-caps inline-block rounded-xl border border-outline-variant/30 bg-surface-container px-8 py-3 text-primary">
              Intake is on a rolling basis.
            </span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function StepNode({ n }: { n: string }) {
  return (
    <div className="absolute left-0 z-20 order-1 flex size-14 items-center justify-center rounded-xl border-2 border-secondary bg-surface md:left-1/2 md:order-2 md:-translate-x-1/2">
      <span className="font-display text-headline-md leading-none text-secondary">{n}</span>
    </div>
  );
}
