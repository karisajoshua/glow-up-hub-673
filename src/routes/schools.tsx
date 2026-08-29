import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const SSPP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDY5ctIx65ZtIdqP1FqBmDc3h6mRL-eDELPU01qJxTiwveZ7Qkc0JUOITaYK34Gjvoh1U8e_5OsnXMVmm1if7YwWlWAyE4QiroRiTIG-0LI5f7Q6UAH4dTwbJQ1vwXZTjaiEZoHucuwkkX2Qej7PLvUVkfqPkiWXWQlt08XHivQ7ZIuh4l8W8AYmEtAgHfz5Dln5pdXbpIR_alVu9IFOQnYNyQ9otIv4HI8Mko6BuIsD6ySqwP_Rch5";
const CBGS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAiRc28byUdcEH6fvY8D8hoac2QQ_O5wz9o2661oZl4I_OP9blSyjUGfG__pLDmmW6_ZC523MpwU6Z6qzbhXCGBhQj-k5EiJ5d8QWgZdwEfdDCTlvP7redXAslOpmmdm81hY4GS4NEK8dtThiXZx_6uAobtYF7zZnPeupf1j0Dy6SP_RxR_pULBVic6BWInE7zX9Tn90ZI8EJZFYyBAbWMnVzuiuWzdWKwk67f6npoz15u3RGomPgIN";

export const Route = createFileRoute("/schools")({
  head: () => ({
    meta: [
      { title: "Schools | S-STC Centers of Excellence" },
      {
        name: "description",
        content:
          "Two schools, one mission: the School of Sustainable Professional Practice and the School of Community Based Green Skilling.",
      },
      { property: "og:title", content: "S-STC Schools — Centers of Excellence" },
      {
        property: "og:description",
        content:
          "Professional sustainability pathways and grassroots green skilling programs at SustainaSpace Training Center.",
      },
      { property: "og:image", content: SSPP_IMG },
      { name: "twitter:image", content: SSPP_IMG },
      { property: "og:url", content: "https://sstc.co.ke/schools" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "S-STC Schools \u2014 Centers of Excellence" },
      { name: "twitter:description", content: "Two schools, one mission: the School of Sustainable Professional Practice and the School of Community Based Green Skilling." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/schools" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sstc.co.ke/"}, {"@type": "ListItem", "position": 2, "name": "Schools", "item": "https://sstc.co.ke/schools"}]}),
      },
    ],
  }),
  component: SchoolsPage,
});

function SchoolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-[120px] pb-section-gap">
        <header className="container-max mb-24 px-margin-mobile md:px-margin-desktop">
          <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
            Schools
          </h1>
          <div className="h-1 w-24 bg-secondary" />
        </header>

        <section className="container-max mb-section-gap px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="group overflow-hidden rounded-md border border-outline-variant/30 md:col-span-7">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${SSPP_IMG}')` }}
                role="img"
                aria-label="Professionals in a collaborative workshop around sustainable materials"
              />
            </div>
            <div className="flex flex-col justify-center md:col-span-5 md:pl-8">
              <span className="label-caps mb-4 text-sage">Professional Pathways</span>
              <h2 className="mb-6 font-display text-headline-md text-primary md:text-headline-lg">
                School of Sustainable Professional Practice (SSPP)
              </h2>
              <p className="mb-8 text-body-lg text-on-surface-variant">
                S-STC&rsquo;s Professional Sustainability Pathways bridge the gap between academic
                qualifications and the sustainability competencies required in today&rsquo;s
                workplaces, hence helping organisations achieve their sustainability commitments.
              </p>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 self-start border-b border-secondary pb-1 text-button text-secondary transition-colors hover:border-transparent"
              >
                Explore SSPP Programs
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-5 md:pr-8">
              <span className="label-caps mb-4 text-sage">Community Impact</span>
              <h2 className="mb-6 font-display text-headline-md text-primary md:text-headline-lg">
                School of Community Based Green Skilling
              </h2>
              <p className="mb-8 text-body-lg text-on-surface-variant">
                Empowering local communities with practical, actionable green skills. This school
                focuses on grassroots initiatives, transforming immediate environments through
                sustainable agriculture, renewable energy basics, and conservation techniques.
              </p>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 self-start border-b border-secondary pb-1 text-button text-secondary transition-colors hover:border-transparent"
              >
                Discover Community Initiatives
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="group order-1 overflow-hidden rounded-md border border-outline-variant/30 md:order-2 md:col-span-7">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${CBGS_IMG}')` }}
                role="img"
                aria-label="Community members tending crops in a thriving community garden"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
