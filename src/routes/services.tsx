import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SERVICES } from "@/lib/schools";

const COVER = SERVICES[0].img;

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Other Services: Community Library & Excursions | S-STC" },
      {
        name: "description",
        content:
          "Beyond our schools: the Readers Community Library serving the host community, and Discovery Excursions exploring the gems of the Western block.",
      },
      { property: "og:title", content: "Other Services — S-STC" },
      {
        property: "og:description",
        content:
          "Readers Community Library and Discovery Excursions from SustainaSpace Training Center.",
      },
      { property: "og:image", content: COVER },
      { name: "twitter:image", content: COVER },
      { property: "og:url", content: "https://sstc.co.ke/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Other Services \u2014 S-STC" },
      {
        name: "twitter:description",
        content:
          "Readers Community Library and Discovery Excursions from SustainaSpace Training Center.",
      },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://sstc.co.ke/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "https://sstc.co.ke/services" },
          ],
        }),
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px]">
        <header className="container-max mb-24 px-margin-mobile md:px-margin-desktop">
          <span className="label-caps mb-4 block text-sage">Other Services</span>
          <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
            Community Services Beyond the Classroom
          </h1>
          <div className="h-1 w-24 bg-secondary" />
        </header>

        {SERVICES.map((s, i) => (
          <section
            key={s.slug}
            id={s.slug}
            className="container-max mb-section-gap scroll-mt-32 px-margin-mobile md:px-margin-desktop"
          >
            <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
              <div
                className={`group overflow-hidden rounded-md border border-outline-variant/30 md:col-span-7 ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${s.img}')` }}
                  role="img"
                  aria-label={s.alt}
                />
              </div>
              <div
                className={`flex flex-col justify-center md:col-span-5 ${
                  i % 2 === 1 ? "md:order-1 md:pr-8" : "md:pl-8"
                }`}
              >
                <h2 className="mb-6 font-display text-headline-md text-primary md:text-headline-lg">
                  {s.name}
                </h2>
                <p className="mb-8 text-body-lg text-on-surface-variant">{s.summary}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 self-start border-b border-secondary pb-1 text-button text-secondary transition-colors hover:border-transparent"
                >
                  Enquire about this service
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
