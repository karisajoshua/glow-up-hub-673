import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const CATALOGUE_COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGEzZb_6JaZ_W9LLB4ScaCIOKB9pRF32sbVsgXdRHgOu4LviZDIXmtUBejXPmjnIdNbSTWfL-fLYsm7kX3HDSM5YnmugtsptbVOab_mmkwvXbu-07N6rHke-BFfP_2GnvjvuRxGzmUZJ3n07nlpxRy7ZAwgQsQW3Gem4qYJBIsOFo98lQh6gA8Lm3Sb-bxHfFnIKorLIW-Fw5OYRKkVx5cPFwUVlZaj32FruM_9cws9Di-LeP12fSS";

type Program = {
  title: string;
  level: string;
  mode: string;
  body: string;
  credits: string;
  alt: string;
  img: string;
};

const PROGRAMS: Program[] = [
  {
    title: "Sustainability Foundations for Professionals",
    level: "Professional Certificate",
    mode: "Fully Online",
    body: "A grounding in Education for Sustainable Development, the UN SDGs and the ILO green skills agenda, translated into practical actions you can apply inside your own profession from week one.",
    credits: "12 weeks",
    alt: "A sustainable architectural model on a clean wooden desk",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGEzZb_6JaZ_W9LLB4ScaCIOKB9pRF32sbVsgXdRHgOu4LviZDIXmtUBejXPmjnIdNbSTWfL-fLYsm7kX3HDSM5YnmugtsptbVOab_mmkwvXbu-07N6rHke-BFfP_2GnvjvuRxGzmUZJ3n07nlpxRy7ZAwgQsQW3Gem4qYJBIsOFo98lQh6gA8Lm3Sb-bxHfFnIKorLIW-Fw5OYRKkVx5cPFwUVlZaj32FruM_9cws9Di-LeP12fSS",
  },
  {
    title: "Climate Risk and Environmental Compliance",
    level: "Short Course",
    mode: "Fully Online",
    body: "Read climate and environmental risk in operational terms: emissions and resource baselines, regulatory expectations, reporting duties and the evidence organisations need to defend their environmental performance.",
    credits: "12 weeks",
    alt: "Researcher's hands examining a green seedling in a laboratory",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQeIkf9aHSKXhWqDjLZQ9lM1NWJjHL9kT5FUQJso5gazaDvqdYPIKG8oo9cPdNs9xUxMgcvg78LmQxjGfEmO2ivn6LkFGlCBcaeBbUaObSQEtwvXnERhen5AdF-4RIAh5P3gpHj0_nY2Pe1iRQSn97p4xW1wf7WAl4K3yxscPSZ4yfY--G2WM38dmC5hiQSa0JVHfC_6_Cq07oKb90ilcTlv3_EitIaekurlX-TX1mkIxyc_dQ-gbu",
  },
  {
    title: "Green Skills for the Built Environment",
    level: "Professional Certificate",
    mode: "Online with Optional Face-to-Face",
    body: "For engineers, architects, quantity surveyors, project managers and facilities teams — resource-efficient design, materials choices, waste reduction and energy performance across the life of a building.",
    credits: "12 weeks",
    alt: "Aerial view of an eco-campus integrated with a natural landscape",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM-waeanp_o5N487YJJUt3AiBPV_Ml3c1fjDt8iRmsP4i20FKuwf1FPxrRsYnWphxJfjif5jDaL65Vg2qSfbYPSfrpf0pNhIeqzUFBZcanlIMdSsvf4KQv0IbI-5ZR0ibHLqXpTDEcZqGN00p_z83ZmsMKurDFdTd9_aIXp6CerFdpqeU3PKt7Tb85TXl7HupWsHRGI48qCynUnq4brw3Lo3rDekbUomV4gskFzwRfvXpaaDMacHv4",
  },
  {
    title: "Community Based Green Skilling",
    level: "Community Programme",
    mode: "Online with Optional Face-to-Face",
    body: "Practical green livelihoods training for community groups, youth cohorts and small enterprises: waste value chains, water stewardship, clean energy basics and income-generating sustainable practice.",
    credits: "12 weeks",
    alt: "Macro photograph of solar panel textures blended with leaf patterns",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOlZqSmYdtOZmMxPrI-DYomMunwmbEApjmwlArsc42N0rhhXTOO7vQ1PW3iIlAfCia9DcTp_tQm9h88EWZkkUYBIFAgKa8a1cAFwQMXY9Bdhsd109CyNHtPXPbUQTTzxeDJ0jMj74RtCxl3OnEdSXA59j_Ok0V51kHYZCGWKIsr2N21oHG4d_dI26ISzNQ8QEYoMijM_1EjivgH4zhhY5I0ExTPTVgCHxMtcW0M0WiIAzn2DrNAr5R",
  },
];

const LEVELS = ["Short Course", "Professional Certificate", "Community Programme"];
const MODES = ["Fully Online", "Online with Optional Face-to-Face"];


export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Program Catalogue | S-STC" },
      {
        name: "description",
        content:
          "Browse S-STC academic pathways by level and delivery mode — rigorous programs bridging professional practice with environmental stewardship.",
      },
      { property: "og:title", content: "Program Catalogue — S-STC" },
      {
        property: "og:description",
        content:
          "Academic pathways designed to bridge high-level professional practice with profound environmental stewardship.",
      },
      { property: "og:image", content: CATALOGUE_COVER },
      { name: "twitter:image", content: CATALOGUE_COVER },
      { property: "og:url", content: "https://sstc.co.ke/programs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Program Catalogue \u2014 S-STC" },
      { name: "twitter:description", content: "Browse S-STC academic pathways by level and delivery mode — rigorous programs bridging professional practice with environmental stewardship." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/programs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "S-STC Programme Catalogue",
          itemListElement: PROGRAMS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Course",
              name: p.title,
              description: p.body,
              url: "https://sstc.co.ke/programs",
              provider: {
                "@type": "EducationalOrganization",
                name: "SustainaSpace Training Center",
                url: "https://sstc.co.ke",
              },
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: p.mode.includes("Online") ? "online" : "blended",
                courseWorkload: "P12W",
              },
            },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sstc.co.ke/"}, {"@type": "ListItem", "position": 2, "name": "Programs", "item": "https://sstc.co.ke/programs"}]}),
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const [levels, setLevels] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const visible = PROGRAMS.filter(
    (p) =>
      (levels.length === 0 || levels.includes(p.level)) &&
      (modes.length === 0 || modes.includes(p.mode)),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow">
        <header className="container-max px-margin-mobile pb-20 pt-[160px] md:px-margin-desktop">
          <div className="max-w-3xl">
            <h1 className="mb-6 font-display text-display-lg text-on-surface">Program Catalogue</h1>
            <p className="text-body-lg text-on-surface-variant">
              Discover our rigorous academic pathways. Each program is meticulously designed to
              bridge high-level professional practice with profound environmental stewardship.
            </p>
          </div>
        </header>

        <section className="container-max grid grid-cols-1 gap-gutter px-margin-mobile pb-section-gap md:px-margin-desktop lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[120px] pr-8">
              <div className="mb-10">
                <h2 className="label-caps mb-4 text-secondary">Academic Level</h2>
                <div className="space-y-3">
                  {LEVELS.map((l) => (
                    <label key={l} className="group flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={levels.includes(l)}
                        onChange={() => toggle(levels, setLevels, l)}
                        className="size-4 rounded-sm border border-outline-variant accent-secondary"
                      />
                      <span className="text-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
                        {l}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="label-caps mb-4 text-secondary">Delivery Mode</h2>
                <div className="space-y-3">
                  {MODES.map((m) => (
                    <label key={m} className="group flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={modes.includes(m)}
                        onChange={() => toggle(modes, setModes, m)}
                        className="size-4 rounded-sm border border-outline-variant accent-secondary"
                      />
                      <span className="text-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
                        {m}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:col-span-9">
            {visible.map((p) => (
              <article
                key={p.title}
                className="group flex flex-col overflow-hidden border border-outline-variant/30 bg-surface-container-lowest transition-colors duration-500 hover:border-outline-variant"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-variant/40">
                  <img
                    loading="lazy"
                    src={p.img}
                    alt={p.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-grow flex-col p-8">
                  <span className="label-caps mb-4 text-secondary">{p.level}</span>
                  <h3 className="mb-4 font-display text-headline-md text-on-surface">{p.title}</h3>
                  <p className="mb-8 flex-grow text-body-md text-on-surface-variant">{p.body}</p>
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
                    <span className="label-caps text-on-surface-variant">
                      {p.credits} · {p.mode}
                    </span>
                    <Link
                      to="/apply"
                      className="inline-flex items-center text-button text-primary transition-colors hover:text-secondary"
                    >
                      Apply Now
                      <span className="material-symbols-outlined ml-1 text-[18px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            {visible.length === 0 && (
              <p className="text-body-md text-on-surface-variant md:col-span-2">
                No programs match the selected filters.
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-outline-variant/20 bg-surface-variant/30 py-section-gap">
          <div className="mx-auto max-w-4xl px-margin-mobile text-center md:px-margin-desktop">
            <h2 className="mb-8 font-display text-headline-lg text-on-surface md:text-display-lg">
              Begin Your Journey
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-body-lg text-on-surface-variant">
              Join a premier cohort of global professionals dedicated to shaping green practice.
              Intake is on a rolling basis.
            </p>
            <Link
              to="/apply"
              className="inline-flex rounded-md bg-primary px-10 py-4 text-button text-on-primary transition-colors hover:bg-secondary"
            >
              Apply Now
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
