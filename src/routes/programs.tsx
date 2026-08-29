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
    title: "Program Title Pending Integration",
    level: "Executive Education",
    mode: "Fully Online",
    body: "A comprehensive description outlining the core competencies, pedagogical approach, and expected global impact of this academic track. Details to follow in upcoming catalogue update.",
    credits: "Credits TBD",
    alt: "A sustainable architectural model on a clean wooden desk",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGEzZb_6JaZ_W9LLB4ScaCIOKB9pRF32sbVsgXdRHgOu4LviZDIXmtUBejXPmjnIdNbSTWfL-fLYsm7kX3HDSM5YnmugtsptbVOab_mmkwvXbu-07N6rHke-BFfP_2GnvjvuRxGzmUZJ3n07nlpxRy7ZAwgQsQW3Gem4qYJBIsOFo98lQh6gA8Lm3Sb-bxHfFnIKorLIW-Fw5OYRKkVx5cPFwUVlZaj32FruM_9cws9Di-LeP12fSS",
  },
  {
    title: "Future Curriculum Designation",
    level: "Postgraduate",
    mode: "Hybrid Structure",
    body: "This framework represents a future offering focused on advanced methodologies in sustainable practice. Full curriculum specifications are currently under rigorous academic review.",
    credits: "Credits TBD",
    alt: "Researcher's hands examining a green seedling in a laboratory",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQeIkf9aHSKXhWqDjLZQ9lM1NWJjHL9kT5FUQJso5gazaDvqdYPIKG8oo9cPdNs9xUxMgcvg78LmQxjGfEmO2ivn6LkFGlCBcaeBbUaObSQEtwvXnERhen5AdF-4RIAh5P3gpHj0_nY2Pe1iRQSn97p4xW1wf7WAl4K3yxscPSZ4yfY--G2WM38dmC5hiQSa0JVHfC_6_Cq07oKb90ilcTlv3_EitIaekurlX-TX1mkIxyc_dQ-gbu",
  },
  {
    title: "Academic Pathway Prototype",
    level: "Undergraduate",
    mode: "On-Campus",
    body: "A placeholder for interdisciplinary studies integrating policy, economics, and environmental science. Content is actively being structured for the next enrollment phase.",
    credits: "Credits TBD",
    alt: "Aerial view of an eco-campus integrated with a natural landscape",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM-waeanp_o5N487YJJUt3AiBPV_Ml3c1fjDt8iRmsP4i20FKuwf1FPxrRsYnWphxJfjif5jDaL65Vg2qSfbYPSfrpf0pNhIeqzUFBZcanlIMdSsvf4KQv0IbI-5ZR0ibHLqXpTDEcZqGN00p_z83ZmsMKurDFdTd9_aIXp6CerFdpqeU3PKt7Tb85TXl7HupWsHRGI48qCynUnq4brw3Lo3rDekbUomV4gskFzwRfvXpaaDMacHv4",
  },
  {
    title: "Specialized Certificate Track",
    level: "Executive Education",
    mode: "Hybrid Structure",
    body: "Intensive, modular learning designed for global change-makers. The specific focus areas and delivery timelines for this module will be published shortly.",
    credits: "Credits TBD",
    alt: "Macro photograph of solar panel textures blended with leaf patterns",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOlZqSmYdtOZmMxPrI-DYomMunwmbEApjmwlArsc42N0rhhXTOO7vQ1PW3iIlAfCia9DcTp_tQm9h88EWZkkUYBIFAgKa8a1cAFwQMXY9Bdhsd109CyNHtPXPbUQTTzxeDJ0jMj74RtCxl3OnEdSXA59j_Ok0V51kHYZCGWKIsr2N21oHG4d_dI26ISzNQ8QEYoMijM_1EjivgH4zhhY5I0ExTPTVgCHxMtcW0M0WiIAzn2DrNAr5R",
  },
];

const LEVELS = ["Undergraduate", "Postgraduate", "Executive Education"];
const MODES = ["On-Campus", "Hybrid Structure", "Fully Online"];

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
                    <span className="label-caps text-on-surface-variant">{p.credits}</span>
                    <Link
                      to="/apply"
                      className="inline-flex items-center text-button text-primary transition-colors hover:text-secondary"
                    >
                      View Details
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
