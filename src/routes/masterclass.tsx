import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MasterclassForm } from "@/components/site/MasterclassForm";
import { MASTERCLASS } from "@/lib/masterclass";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAiRc28byUdcEH6fvY8D8hoac2QQ_O5wz9o2661oZl4I_OP9blSyjUGfG__pLDmmW6_ZC523MpwU6Z6qzbhXCGBhQj-k5EiJ5d8QWgZdwEfdDCTlvP7redXAslOpmmdm81hY4GS4NEK8dtThiXZx_6uAobtYF7zZnPeupf1j0Dy6SP_RxR_pULBVic6BWInE7zX9Tn90ZI8EJZFYyBAbWMnVzuiuWzdWKwk67f6npoz15u3RGomPgIN";

const DESCRIPTION =
  "A half-day virtual masterclass that takes you from wanting a green job to proving you are ready for one — green job market, employer expectations, four key green skills and your professional profile.";

export const Route = createFileRoute("/masterclass")({
  head: () => ({
    meta: [
      { title: "Green Job Readiness Masterclass | S-STC" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Green Job Readiness Masterclass — S-STC" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:image", content: HERO_IMG },
      { property: "og:url", content: "https://sstc.co.ke/masterclass" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Green Job Readiness Masterclass — S-STC" },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/masterclass" }],
  }),
  component: MasterclassPage,
});

function MasterclassPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px] md:pt-[140px]">
        <header className="container-max mb-16 px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            <div className="md:col-span-7">
              <span className="label-caps mb-4 inline-block rounded-md border border-secondary/40 bg-secondary/10 px-4 py-2 text-secondary">
                Masterclass
              </span>
              <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
                {MASTERCLASS.title}
              </h1>
              <p className="mb-6 max-w-2xl text-body-lg text-on-surface">{MASTERCLASS.tagline}</p>
              <blockquote className="max-w-2xl border-l-2 border-secondary pl-5 font-display text-headline-sm italic text-primary">
                {MASTERCLASS.quote}
              </blockquote>
              <a
                href="#apply"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary"
              >
                Apply now
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
            <div className="md:col-span-5">
              <img
                src={HERO_IMG}
                alt="Facilitator leading a practical green skills session with learners"
                loading="lazy"
                className="h-72 w-full rounded-lg border border-outline-variant/20 object-cover shadow-sm md:h-full"
              />
            </div>
          </div>
        </header>

        <section className="container-max mb-16 px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-2 gap-gutter rounded-lg border border-outline-variant/30 bg-surface-container-low p-8 md:grid-cols-4">
            <Detail icon="event" label="Date" value={MASTERCLASS.date} />
            <Detail icon="schedule" label="Time" value={MASTERCLASS.time} />
            <Detail icon="videocam" label="Venue" value={MASTERCLASS.venue} />
            <Detail icon="payments" label="Investment" value={MASTERCLASS.fee} />
          </div>
        </section>

        <section className="container-max mb-16 px-margin-mobile md:px-margin-desktop">
          <h2 className="mb-8 font-display text-headline-lg text-primary">What You&apos;ll Gain</h2>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {MASTERCLASS.gains.map((gain) => (
              <div
                key={gain.title}
                className="rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="material-symbols-outlined mb-4 block text-3xl text-secondary">
                  {gain.icon}
                </span>
                <h3 className="mb-3 font-display text-headline-sm text-primary">{gain.title}</h3>
                <p className="text-body-md text-on-surface-variant">{gain.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-max mb-16 px-margin-mobile md:px-margin-desktop">
          <div className="rounded-lg border border-outline-variant/30 bg-surface p-8">
            <p className="label-caps mb-2 text-on-surface-variant">Facilitator</p>
            <h2 className="mb-2 font-display text-headline-md text-primary">
              {MASTERCLASS.facilitator.name}
            </h2>
            <p className="mb-4 text-body-md text-on-surface-variant">
              {MASTERCLASS.facilitator.role}
            </p>
            <a
              href={`https://wa.me/${MASTERCLASS.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-button text-secondary hover:text-primary"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              {MASTERCLASS.facilitator.phone}
            </a>
          </div>
        </section>

        <section id="apply" className="container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            <div className="md:col-span-8">
              <MasterclassForm />
            </div>
            <aside className="md:col-span-4">
              <div className="rounded-lg border-l-2 border-secondary bg-surface-container-low p-6">
                <h3 className="mb-3 font-display text-headline-sm text-primary">
                  How payment works
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  The masterclass investment is {MASTERCLASS.fee}. Once you send your registration PDF
                  on WhatsApp, {MASTERCLASS.facilitator.name} replies with the payment instructions and
                  your Google Meet joining link. No payment is taken on this website.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Detail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <span className="material-symbols-outlined mb-2 block text-2xl text-secondary">{icon}</span>
      <p className="label-caps mb-1 text-on-surface-variant">{label}</p>
      <p className="font-display text-title-lg text-primary">{value}</p>
    </div>
  );
}
