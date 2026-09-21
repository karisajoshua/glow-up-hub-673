import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MasterclassForm } from "@/components/site/MasterclassForm";
import euniceAsset from "@/assets/eunice-barasa.jpg.asset.json";
import { MASTERCLASS, UPCOMING_MASTERCLASSES } from "@/lib/masterclass";

const SOCIAL_IMAGE = `https://sstc.co.ke${euniceAsset.url}`;

const DESCRIPTION =
  "A half-day virtual masterclass that takes you from wanting a green job to proving you are ready for one — green job market, employer expectations, four key green skills and your professional profile.";

export const Route = createFileRoute("/masterclass")({
  head: () => ({
    meta: [
      { title: "Green Job Readiness Masterclass | S-STC" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Green Job Readiness Masterclass — S-STC" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: SOCIAL_IMAGE },
      { name: "twitter:image", content: SOCIAL_IMAGE },
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
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7 md:pr-6">
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
              <div className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface shadow-sm">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={euniceAsset.url}
                    alt="Eunice Barasa, Green Job Readiness Masterclass facilitator"
                    className="h-full w-full object-cover object-[center_28%]"
                  />
                </div>
                <div className="border-t border-outline-variant/30 p-6">
                  <p className="label-caps mb-2 text-secondary">Your facilitator</p>
                  <h2 className="mb-1 font-display text-headline-md text-primary">
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
                    <span className="material-symbols-outlined text-sm">chat</span>
                    {MASTERCLASS.facilitator.phone}
                  </a>
                </div>
              </div>
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
          <span className="label-caps mb-4 inline-block rounded-md border border-secondary/40 bg-secondary/10 px-4 py-2 text-secondary">
            Upcoming masterclass
          </span>
          <h2 className="mb-6 font-display text-headline-lg text-primary md:text-display-md">
            {DIGITAL_CAREER_COMPASS.title}
          </h2>
          <div className="mb-8 max-w-3xl">
            {DIGITAL_CAREER_COMPASS.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mb-4 text-body-lg text-on-surface">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mb-10 grid grid-cols-1 gap-gutter md:grid-cols-2">
            {DIGITAL_CAREER_COMPASS.points.map((point) => (
              <div
                key={point.title}
                className="rounded-lg border border-outline-variant/30 bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="material-symbols-outlined mb-4 block text-3xl text-secondary">
                  {point.icon}
                </span>
                <h3 className="mb-3 font-display text-headline-sm text-primary">{point.title}</h3>
                <p className="text-body-md text-on-surface-variant">{point.body}</p>
              </div>
            ))}
          </div>
          <div className="mb-10 grid grid-cols-2 gap-gutter rounded-lg border border-outline-variant/30 bg-surface-container-low p-8 md:grid-cols-4">
            <Detail icon="event" label="Date" value={DIGITAL_CAREER_COMPASS.date} />
            <Detail icon="schedule" label="Time" value={DIGITAL_CAREER_COMPASS.time} />
            <Detail icon="videocam" label="Venue" value={DIGITAL_CAREER_COMPASS.venue} />
            <Detail icon="payments" label="Investment" value={DIGITAL_CAREER_COMPASS.fee} />
          </div>
          <a
            href="#apply-digital-career-compass"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary"
          >
            Apply now
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </section>

        <section className="container-max mb-16 px-margin-mobile md:px-margin-desktop">
          <h2 className="mb-3 font-display text-headline-lg text-primary">
            Upcoming Masterclasses
          </h2>
          <p className="mb-8 max-w-2xl text-body-md text-on-surface-variant">
            More masterclasses are being scheduled. Register your interest with us and we will share
            dates as soon as they are confirmed.
          </p>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {UPCOMING_MASTERCLASSES.map((m) => (
              <div
                key={m.title}
                className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-8"
              >
                <span className="material-symbols-outlined mb-4 block text-3xl text-secondary">
                  {m.icon}
                </span>
                <h3 className="mb-2 font-display text-headline-sm text-primary">{m.title}</h3>
                <p className="mb-3 text-body-md font-medium text-secondary">{m.subtitle}</p>
                <p className="mb-4 text-body-md text-on-surface-variant">{m.body}</p>
                <span className="label-caps text-on-surface-variant">Dates coming soon</span>
              </div>
            ))}
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
                <p className="mb-4 text-body-md text-on-surface-variant">
                  The masterclass investment is {MASTERCLASS.fee}. Once you send your registration PDF
                  on WhatsApp, S-STC sends you the payment instructions and your Google Meet joining
                  link. You can pay securely through our PayPal link below, or follow the payment
                  instructions we send you after registration.
                </p>
                <a
                  href="https://www.paypal.com/ncp/payment/CQ3XNRDHUJQJ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-button text-on-primary transition-colors hover:bg-secondary"
                >
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  Pay with PayPal
                </a>
                <p className="mt-3 text-body-sm text-on-surface-variant">
                  Pay {MASTERCLASS.fee} and include your full name as the payment reference so we can
                  match your payment to your registration.
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
