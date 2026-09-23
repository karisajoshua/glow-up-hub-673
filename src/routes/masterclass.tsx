import { createFileRoute } from "@tanstack/react-router";

import euniceAsset from "@/assets/eunice-barasa.jpg.asset.json";
import { MasterclassForm } from "@/components/site/MasterclassForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DIGITAL_CAREER_COMPASS, MASTERCLASS, UPCOMING_MASTERCLASSES } from "@/lib/masterclass";

const SOCIAL_IMAGE = `https://sstc.co.ke${euniceAsset.url}`;
const DESCRIPTION = "Practical S-STC masterclasses for green and digital careers — build skills, evidence and professional readiness for your next opportunity.";

export const Route = createFileRoute("/masterclass")({
  head: () => ({ meta: [
    { title: "Career Masterclasses | S-STC" }, { name: "description", content: DESCRIPTION },
    { property: "og:title", content: "Career Masterclasses — S-STC" }, { property: "og:description", content: DESCRIPTION },
    { property: "og:image", content: SOCIAL_IMAGE }, { property: "og:url", content: "https://sstc.co.ke/masterclass" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://sstc.co.ke/masterclass" }] }),
  component: MasterclassPage,
});

function MasterclassPage() {
  return <div className="flex min-h-screen flex-col bg-background">
    <SiteHeader />
    <main className="flex-grow pt-[88px] md:pt-[104px]">
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <div className="container-max relative grid items-center gap-10 px-margin-mobile py-14 md:grid-cols-12 md:px-margin-desktop md:py-20">
          <div className="md:col-span-7">
            <span className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">Live virtual masterclass · Limited registration</span>
            <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">{MASTERCLASS.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{MASTERCLASS.tagline}</p>
            <div className="mt-7 flex items-center gap-3">
              <img src={euniceAsset.url} alt={MASTERCLASS.facilitator.name} className="h-11 w-11 rounded-full border-2 border-white/70 object-cover object-[center_28%]" />
              <div><p className="text-xs text-white/60">Facilitated by</p><p className="text-sm font-semibold text-white">{MASTERCLASS.facilitator.name}</p><p className="text-xs text-white/70">{MASTERCLASS.facilitator.role}</p></div>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#register" className="inline-flex items-center gap-2 rounded-md bg-secondary px-7 py-3.5 font-semibold text-white">Reserve your place <span className="material-symbols-outlined text-lg">arrow_forward</span></a>
              <a href="#learn" className="rounded-md border border-white/30 px-7 py-3.5 font-semibold text-white hover:bg-white/10">See what you’ll learn</a>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-7 text-on-surface shadow-2xl">
              <Detail icon="event" label="Date" value={MASTERCLASS.date} />
              <Detail icon="schedule" label="Time" value={MASTERCLASS.time} />
              <Detail icon="videocam" label="Location" value={MASTERCLASS.venue} />
              <Detail icon="payments" label="Investment" value={MASTERCLASS.fee} />
              <a href="#register" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-6 py-3.5 font-semibold text-white">Register Now <span className="material-symbols-outlined text-lg">arrow_forward</span></a>
              <p className="mt-3 text-center text-xs text-on-surface-variant">Secure your place. Joining details are released after payment verification.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="learn" className="container-max px-margin-mobile py-16 md:px-margin-desktop md:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center"><span className="label-caps text-secondary">Practical. Relevant. Career-focused.</span><h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">Leave with more than information</h2><p className="mt-4 text-body-lg text-on-surface-variant">Build the language, evidence and professional positioning you need to compete for opportunities in the green economy.</p></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{MASTERCLASS.gains.map((gain,i)=><article key={gain.title} className="rounded-xl border border-outline-variant/30 bg-surface p-7 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary"><span className="material-symbols-outlined">{gain.icon}</span></div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">0{i+1}</p><h3 className="font-display text-xl text-primary">{gain.title}</h3><p className="mt-3 text-body-md leading-7 text-on-surface-variant">{gain.body}</p></article>)}</div>
      </section>

      <section className="bg-surface-container-low"><div className="container-max grid gap-10 px-margin-mobile py-16 md:grid-cols-2 md:px-margin-desktop">
        <div><span className="label-caps text-secondary">Who this is for</span><h2 className="mt-3 font-display text-3xl text-primary">For people ready to turn interest into evidence</h2><p className="mt-4 text-body-lg leading-8 text-on-surface-variant">Ideal for students, graduates, professionals changing direction, development practitioners and anyone seeking a credible entry point into green careers.</p></div>
        <div className="grid gap-4">{["Understand where your existing skills fit in the green economy","Identify gaps employers expect you to close","Position your CV, LinkedIn and experience more convincingly","Leave with clear next actions instead of generic career advice"].map(x=><div key={x} className="flex gap-3 rounded-lg bg-surface p-5"><span className="material-symbols-outlined text-secondary">check_circle</span><p>{x}</p></div>)}</div>
      </div></section>

      <section id="register" className="container-max grid gap-8 px-margin-mobile py-16 md:grid-cols-12 md:px-margin-desktop md:py-20">
        <div className="md:col-span-8"><MasterclassForm /></div>
        <aside className="space-y-5 md:col-span-4">
          <div className="rounded-xl bg-primary p-7 text-on-primary"><span className="material-symbols-outlined text-3xl text-secondary">verified_user</span><h3 className="mt-4 font-display text-2xl">From registration to joining</h3><ol className="mt-5 space-y-4 text-sm text-white/80"><li><strong className="text-white">1.</strong> Complete your registration.</li><li><strong className="text-white">2.</strong> Pay the {MASTERCLASS.fee} investment.</li><li><strong className="text-white">3.</strong> S-STC verifies your payment.</li><li><strong className="text-white">4.</strong> Your Google Meet details are released.</li></ol></div>
          <div className="rounded-xl border border-outline-variant/30 bg-surface p-7"><p className="label-caps text-secondary">Payment options</p><h3 className="mt-2 font-display text-xl text-primary">M-Pesa & PayPal</h3><p className="mt-3 text-sm leading-6 text-on-surface-variant">Your joining link is only released after payment verification. Automated M-Pesa and PayPal verification is the next integration.</p><a href="https://www.paypal.com/ncp/payment/CQ3XNRDHUJQJ8" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-button text-secondary hover:underline">Pay with PayPal <span className="material-symbols-outlined text-sm">open_in_new</span></a></div>
        </aside>
      </section>

      <section className="container-max px-margin-mobile pb-16 md:px-margin-desktop"><div className="rounded-2xl border border-outline-variant/30 bg-surface p-8 md:p-10"><span className="label-caps text-secondary">Also open for registration</span><div className="mt-4 grid gap-8 md:grid-cols-2 md:items-start"><div><h2 className="font-display text-3xl text-primary">{DIGITAL_CAREER_COMPASS.title}</h2><p className="mt-4 text-body-md leading-7 text-on-surface-variant">{DIGITAL_CAREER_COMPASS.intro[1]}</p><p className="mt-5 text-sm text-on-surface-variant">{DIGITAL_CAREER_COMPASS.date} · {DIGITAL_CAREER_COMPASS.time} · <strong className="text-primary">{DIGITAL_CAREER_COMPASS.fee}</strong></p></div><div><MasterclassForm masterclass="digital-career-compass"/></div></div></div></section>

      <section className="container-max px-margin-mobile pb-20 md:px-margin-desktop"><h2 className="font-display text-3xl text-primary">Coming next</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{UPCOMING_MASTERCLASSES.map(m=><div key={m.title} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-7"><span className="material-symbols-outlined text-3xl text-secondary">{m.icon}</span><h3 className="mt-4 font-display text-xl text-primary">{m.title}</h3><p className="mt-1 font-medium text-secondary">{m.subtitle}</p><p className="mt-3 text-body-md text-on-surface-variant">{m.body}</p></div>)}</div></section>
    </main><SiteFooter />
  </div>;
}
function Detail({icon,label,value}:{icon:string;label:string;value:string}){return <div className="mb-5 flex gap-4"><span className="material-symbols-outlined mt-0.5 text-2xl text-secondary">{icon}</span><div><p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p><p className="mt-0.5 font-semibold text-primary">{value}</p></div></div>;}
