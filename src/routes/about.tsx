import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADePia6pOBkj28z5IYkmwSiCpQ9GLdI37ukCtKwp3-DyWV3UVnVcbxDkLwBGkSX1MWC27vYEAQtRJWLV3Y5935K0bdT3GN1kaJDtQYUHgSCY5yNz2-tKUWr6M45u041obhXuBsuc01Mrev9h2TjnbjPeRWW7iq-3wR0LGojs4kr7U3Wege-OX9jWURs7vUsqDloANE3qFlen18-lsdT7dYSHhwABcHpTwolvroIkhXxwN-iThau3tc";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About S-STC | Shaping Green Practice" },
      {
        name: "description",
        content:
          "Our core ethos: sustainability is not a subject to be studied but a pathway to be lived and practised, transforming professional competence into Green Practice.",
      },
      { property: "og:title", content: "About S-STC — Our Core Ethos" },
      {
        property: "og:description",
        content:
          "The academic and training philosophy behind SustainaSpace Training Center's green practice pathways.",
      },
      { property: "og:image", content: COVER },
      { name: "twitter:image", content: COVER },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-[100px]">
        <section className="container-max grid grid-cols-1 gap-gutter px-margin-mobile py-section-gap md:grid-cols-12 md:px-margin-desktop">
          <div className="md:col-span-9">
            <span className="label-caps mb-4 block text-sage">Our Core Ethos</span>
            <h1 className="font-display text-display-lg leading-tight text-primary md:text-display-xl">
              Shaping Green Practice for a Sustainable Future.
            </h1>
          </div>
        </section>

        <section className="relative mb-section-gap h-[420px] w-full md:h-[614px]">
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${COVER}')` }}
            role="img"
            aria-label="A sustainable academic building blending with a lush green landscape"
          />
        </section>

        <section className="container-max grid grid-cols-1 gap-gutter px-margin-mobile pb-section-gap md:grid-cols-12 md:px-margin-desktop">
          <div className="md:col-span-4">
            <h2 className="font-display text-headline-lg text-primary md:sticky md:top-32">
              Institution&rsquo;s Philosophy
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="mb-12 text-body-lg text-on-surface-variant">
              &ldquo;We believe sustainability is not a subject to be studied but a pathway to be
              lived and practised, transforming professional competence into Green Practice.&rdquo;
            </p>
            <div className="mb-12 h-px w-full bg-outline-variant/50" />
            <h3 className="mb-6 font-display text-headline-md text-primary">
              Academic and Training Philosophy
            </h3>
            <p className="text-body-md text-on-surface-variant">
              &ldquo;We endorse professional knowledge, build sustainability literacy that
              translates to green skills and finally to transformative workplace practice and green
              entrepreneurship.&rdquo;
            </p>
          </div>
        </section>

        <section className="container-max px-margin-mobile pb-section-gap md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {[
              {
                title: "Professional Competence",
                body: "Bridging the gap between traditional academic rigor and actionable environmental stewardship.",
                alt: "A professional working in a bright, plant-filled design studio",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5H6MyxCNy7S_4KUCExU6ebFRCrmh8W6B4P564FNsWpY3kptQcRe7n-S-mk0lsHdoockJah5NgkiD_0VN8pPyQBB5GBDCAPx35mN58ix8ecyuWIFHJz_IHOS6UvDUc4wEt8c9G5Id-gYwDnhH94umQVoXS2jduydKiHuoHStYh0xN7lMSs_XyTx-nrO5443iOdm8fK-FsLDYFRgDfAndLWDm9S-fx_bLA0n-GCSw1AJDl58pZatV1U",
                offset: "",
              },
              {
                title: "Green Entrepreneurship",
                body: "Empowering leaders to integrate sustainable practices into core business strategies and global initiatives.",
                alt: "Professionals collaborating in a sunlit boardroom",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2vdqyDodqcAsAKRnmZQtjmNz2RY-Kg0hZdltfoylMlzkE-0zjcBj9O5ke6PQupFhE17JNCuGvjdJR_3gahBVo_egXcuGMGkDY0scCcG9WJO8bRpKayJRlJTmoPcE28d8JpQBFYgKb0uGc0vuaFpIX7prmkpKY51_1F35BKhPoVUiI59n7QGo6j8tVtxdbrrWrIKFKDOWrzNCvtK0ECwgS3lM_CDUaDYbDVoQ5uLQXqnoaxwYEnCF9",
                offset: "md:mt-16",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`group overflow-hidden border border-outline-variant/30 bg-surface-container-lowest p-8 transition-shadow hover:shadow-sm ${c.offset}`}
              >
                <img
                  loading="lazy"
                  src={c.img}
                  alt={c.alt}
                  className="mb-6 h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <h4 className="mb-4 font-display text-headline-md text-primary">{c.title}</h4>
                <p className="text-body-md text-on-surface-variant">{c.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
