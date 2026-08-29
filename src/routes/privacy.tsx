import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | S-STC" },
      {
        name: "description",
        content:
          "How SustainaSpace Training Center collects, uses and protects personal information shared through applications and enquiries.",
      },
      { property: "og:title", content: "Privacy Policy — S-STC" },
      {
        property: "og:description",
        content: "Our commitment to protecting the personal data of applicants and enquirers.",
      },
      { property: "og:url", content: "https://sstc.co.ke/privacy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Privacy Policy \u2014 S-STC" },
      { name: "twitter:description", content: "How SustainaSpace Training Center collects, uses and protects personal information shared through applications and enquiries." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/privacy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sstc.co.ke/"}, {"@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://sstc.co.ke/privacy"}]}),
      },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect the details you provide in application forms and enquiry forms, such as your name, email address, programme of interest and any supporting documents you choose to send us.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information is used solely to process applications, respond to enquiries, share fee schedules and inform you about programmes you have expressed interest in.",
  },
  {
    title: "Sharing and Retention",
    body: "We do not sell your personal information. Application details may be shared with our review partners for assessment purposes only, and are retained no longer than necessary.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information at any time by writing to info@sstc.co.ke.",
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-max w-full flex-grow px-margin-mobile pb-section-gap pt-[160px] md:px-margin-desktop">
        <h1 className="mb-6 font-display text-display-lg text-primary">Privacy Policy</h1>
        <p className="mb-16 max-w-2xl text-body-lg text-on-surface-variant">
          SustainaSpace Training Center (S-STC) is committed to protecting the privacy of applicants,
          learners and partners.
        </p>
        <div className="max-w-3xl space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.title} className="border-t border-outline-variant/50 pt-8">
              <h2 className="mb-4 font-display text-headline-md text-primary">{s.title}</h2>
              <p className="text-body-md text-on-surface-variant">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
