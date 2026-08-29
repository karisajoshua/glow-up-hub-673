import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const POLLUTION_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAnNSjAQRrQYglCzHL5RcFFydF9itqyrXUxvTkaWEG2meHDx_4vmuqQq4_hAtu03yY7IHCAhRDK-o61Q8wveC18ke-PtLOXzrcDnjSa9l5w5qn464N0q7oeTpYnShpgMF5MemJOtGcNnZeJ87IHm63ir5ToUJGQOq8wE6CDOsnHsNT-J_BYEwiFbKxROmmM2AdPjo938rHH3cyhYqi99N-En9Ok-TwuGJq6LS8B3_oVCHrQWyUrnMk2";

const CRISES = [
  {
    title: "Pollution",
    icon: "factory",
    alt: "Editorial photograph depicting pollution against bright skies",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnNSjAQRrQYglCzHL5RcFFydF9itqyrXUxvTkaWEG2meHDx_4vmuqQq4_hAtu03yY7IHCAhRDK-o61Q8wveC18ke-PtLOXzrcDnjSa9l5w5qn464N0q7oeTpYnShpgMF5MemJOtGcNnZeJ87IHm63ir5ToUJGQOq8wE6CDOsnHsNT-J_BYEwiFbKxROmmM2AdPjo938rHH3cyhYqi99N-En9Ok-TwuGJq6LS8B3_oVCHrQWyUrnMk2",
    offset: "",
  },
  {
    title: "Resource Depletion",
    icon: "water_drop",
    alt: "Dry, cracked earth bathed in warm sunlight",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCz80RbmP9kd-tcIukSQLdUK8FTp0EOoUJ_1or138z0JUoNEeqPoVKOIc7eJZ-FSVrIf-0c0IvjptDfx8GCFWJvKTy9Tu4p0IuhM7_h3vXfIqMvIsV09-4vQY_Ap6P72JU6qIVVWuQP-QenVOZvkfLUZ9RyQ2YPbXTVvBLfSUr5IEf3Aia7uPUelhAIPxpMSDEfmiGr3KsC0zz3lSn2HlfnD3UFuzNfvlVhukIUWEQb7z7UizJg_fHv",
    offset: "sm:mt-12",
  },
  {
    title: "Climate Change",
    icon: "thermostat",
    alt: "Dramatic cloud formations over a minimalist landscape",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2yVNkwZdLj6AhvgbEIwJl_TE7e5453cy2xcOZJCsYLbtAE-eMpiHOpJTIPQ2Z7SD36hAoBohiFnZRQntCsAi_xy9vNL-hXZsCuCmFUwy-oRRkEXviPHCNLYc3ORl3al4hGNQb__Jhkjy7nBu9latCi5Eq79LcM9CY0Br_81xnNJjNFbaZ8UM4op2Xg7OUlbNRlDAxwCw70iQomVQoSUaGil8WiBylp5mKQxbYf-uIOBv1rrmZBQfS",
    offset: "",
  },
  {
    title: "Sustainable Livelihoods",
    icon: "eco",
    alt: "Professionals working in green technology and agriculture",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU77krm0uyNWBbTHS_g4Pn4I-vCYH084YAJCRvayIRU_IsdamzdtUI9aduOHkgoheWtWcFOueFwTELsgyl8YwJAiF0mLajD_KcZZ6WQtrrzyfdvQ1R_NEUVBbRvjxT0QKIWR_SOWa2REqowHrRTFhECytmV6QuzHyX76BjG-PgAyB-QuW3Wnla4sfXLQ3378V6fr8EWntBbyc2rKiJXmIoVgXHaSLuUJMdGAFlM0G5r3M-olyrvruB",
    offset: "sm:mt-12",
  },
];

export const Route = createFileRoute("/frameworks")({
  head: () => ({
    meta: [
      { title: "Foundational Frameworks | S-STC" },
      {
        name: "description",
        content:
          "S-STC aligns with Education for Sustainable Development, the UN SDGs and the ILO agenda on Skills for a Greener Future and decent work in a green economy.",
      },
      { property: "og:title", content: "Our Foundational Frameworks — S-STC" },
      {
        property: "og:description",
        content:
          "Addressing the triple-plus-one global crises: pollution, resource depletion, climate change and sustainable livelihoods.",
      },
      { property: "og:image", content: POLLUTION_IMG },
      { name: "twitter:image", content: POLLUTION_IMG },
    ],
  }),
  component: FrameworksPage,
});

function FrameworksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-20">
        <section className="container-max px-margin-mobile py-section-gap md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
            <div className="md:col-span-9">
              <span className="label-caps mb-4 block text-secondary">Foundational Principles</span>
              <h1 className="mb-8 font-display text-display-lg leading-tight text-primary md:text-display-xl">
                Our Foundational Frameworks
              </h1>
              <p className="text-body-lg text-on-surface-variant md:w-4/5">
                S-STC supports the aspirations of internationally recognized frameworks and more
                especially Education for Sustainable Development (ESD), the United Nations
                Sustainable Development Goals (SDGs), and the International Labour Organization (ILO)
                agenda on Skills for a Greener Future and the promotion of decent work within a green
                economy.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant/20 bg-surface-variant/40 py-section-gap">
          <div className="container-max px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="mb-6 font-display text-headline-lg text-primary">
                  Addressing the Triple-Plus-1 Global Crises
                </h2>
                <p className="mb-8 text-body-md text-on-surface-variant">
                  We believe every profession has a role to play in addressing the triple-plus-1
                  global crises — pollution, resource depletion, climate change and sustainable
                  livelihoods.
                </p>
                <p className="text-body-md text-on-surface-variant">
                  We achieve this by integrating practical green skills so that through their chosen
                  fields of practice, professionals will support their organisational performance on
                  matters of the environment in order to meet sustainability expectations of their
                  respective organisations.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-7 md:mt-0">
                {CRISES.map((c) => (
                  <div
                    key={c.title}
                    className={`group overflow-hidden rounded-lg border border-outline-variant/30 bg-surface transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${c.offset}`}
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        loading="lazy"
                        src={c.img}
                        alt={c.alt}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <span className="material-symbols-outlined mb-3 text-3xl text-secondary">
                        {c.icon}
                      </span>
                      <h3 className="font-display text-headline-sm text-primary">{c.title}</h3>
                      <div className="mt-4 h-1 w-12 rounded bg-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
