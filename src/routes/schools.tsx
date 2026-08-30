import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SCHOOL_LIST } from "@/lib/schools";

const COVER = SCHOOL_LIST[0]!.img;

export const Route = createFileRoute("/schools")({
  head: () => ({
    meta: [
      { title: "Our Four Schools | S-STC Green Skills Training" },
      {
        name: "description",
        content:
          "Four schools, one mission: Sustainable Professional Practice, Sustainable Skills & Technologies, Digital Literacy and Transitional Skills.",
      },
      { property: "og:title", content: "S-STC Schools — Centers of Excellence" },
      {
        property: "og:description",
        content:
          "Professional sustainability pathways, hands-on green making, digital literacy and transitional skills at SustainaSpace Training Center.",
      },
      { property: "og:image", content: COVER },
      { name: "twitter:image", content: COVER },
      { property: "og:url", content: "https://sstc.co.ke/schools" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "S-STC Schools \u2014 Centers of Excellence" },
      {
        name: "twitter:description",
        content:
          "Four schools, one mission: Sustainable Professional Practice, Sustainable Skills & Technologies, Digital Literacy and Transitional Skills.",
      },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/schools" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://sstc.co.ke/" },
            { "@type": "ListItem", position: 2, name: "Schools", item: "https://sstc.co.ke/schools" },
          ],
        }),
      },
    ],
  }),
  component: SchoolsPage,
});

function SchoolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pb-section-gap pt-[120px]">
        <header className="container-max mb-24 px-margin-mobile md:px-margin-desktop">
          <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
            S-STC Schools: Centers of Excellence in Green Practice
          </h1>
          <div className="h-1 w-24 bg-secondary" />
        </header>

        {SCHOOL_LIST.map((s, i) => (
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
                <span className="label-caps mb-4 text-sage">{s.tagline}</span>
                <h2 className="mb-6 font-display text-headline-md text-primary md:text-headline-lg">
                  {s.name}
                </h2>
                <p className="mb-6 text-body-lg text-on-surface-variant">{s.description}</p>

                {s.programs.length > 0 ? (
                  <ul className="mb-8 space-y-3 border-t border-outline-variant/30 pt-6">
                    {s.programs.map((p) => (
                      <li key={p.title}>
                        <span className="block font-display text-title-lg text-primary">
                          {p.title}
                        </span>
                        <span className="text-body-md text-on-surface-variant">{p.summary}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-8 border-t border-outline-variant/30 pt-6 text-body-md italic text-on-surface-variant/80">
                    {s.note}
                  </p>
                )}

                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 self-start border-b border-secondary pb-1 text-button text-secondary transition-colors hover:border-transparent"
                >
                  Explore programmes
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
