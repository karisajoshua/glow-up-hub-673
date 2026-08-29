import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";


const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA4TBDgdehGhnklIP8PybBJyoobw5edWsbJKj_8UDTQe_DxDbudLLSLfs_yzk-Js4DHPd1dpIoL6sp5y2CN0Ho86IyMFjYQbOF6aUfyboMceIuZxbIp4Sp1g-3RM25L8hs7X7be9Ou69mxQdpTul-W5TDC_RPyMlu-KxHUSl-ClRfFr4eNFj57LvFzV9DDVOb4auChO54smeTwuSPI_3H9D67m7UbJAq3U1xlpGVgPGFwm4FanXwPct";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "S-STC | Sustainability & Green Skills Training Kenya" },
      {
        name: "description",
        content:
          "S-STC links professional qualifications with sustainability learning pathways, building the green competencies employers, investors and regulators now expect.",
      },
      { property: "og:title", content: "S-STC — Shaping Green Practice" },
      {
        property: "og:description",
        content:
          "Sustainability learning pathways that complement academic and professional qualifications with missing green competencies.",
      },
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:image", content: HERO_IMG },
      { property: "og:url", content: "https://sstc.co.ke/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "S-STC \u2014 Shaping Green Practice" },
      { name: "twitter:description", content: "S-STC links professional qualifications with sustainability learning pathways, building the green competencies employers, investors and regulators now expect." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative flex min-h-screen items-center overflow-hidden pt-24 md:pt-0">
          <div className="absolute inset-0 z-0">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_IMG}')` }}
            />
            <div className="absolute inset-0 bg-primary/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          </div>
          <div className="container-max relative z-10 w-full px-margin-mobile py-24 md:px-margin-desktop">
            <div className="max-w-4xl">
              <h1 className="mb-8 font-display text-display-lg text-surface-bright md:text-display-xl">
                Sustainability and Green Skills Training for Professionals
              </h1>
              <div className="max-w-3xl space-y-6 border-l-2 border-secondary-fixed-dim pl-6 text-body-lg text-surface-bright/90 md:pl-8">
                <p>
                  Sustainability is shaping how we think, what we value, how we act and the choices
                  we make — and employers, governments, investors and consumers are seeking to
                  engage with stakeholders who are environmentally responsible, socially accountable
                  and economically resilient.
                </p>
                <p>
                  The regulatory environment is also shifting in favour of sustainability, meaning
                  professionals with green skills are more preferred.
                </p>
                <p className="pt-2 font-display text-headline-md text-surface-bright">
                  Are you ready?
                </p>
                <p>
                  SustainaSpace Training Center (S-STC) bridges this gap by linking this emerging
                  reality with sustainability learning pathways that complement existing academic
                  and professional qualifications with missing green competencies.
                </p>
              </div>
              <div className="mt-12 flex flex-col gap-6 sm:flex-row">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center rounded-md bg-secondary-container px-8 py-4 text-button text-on-secondary-fixed transition-colors hover:bg-surface-bright"
                >
                  Apply for Programs
                </Link>
                <Link
                  to="/frameworks"
                  className="inline-flex items-center justify-center rounded-md border border-surface-bright px-8 py-4 text-button text-surface-bright transition-colors hover:bg-surface-bright hover:text-primary"
                >
                  Explore Frameworks
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="container-max px-margin-mobile py-section-gap md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="md:col-span-5 md:col-start-2">
              <h2 className="label-caps mb-4 text-secondary">Institution&apos;s Philosophy</h2>
              <h3 className="mb-8 font-display text-headline-md leading-tight text-on-surface md:text-headline-lg">
                &ldquo;We believe sustainability is not a subject to be studied but a pathway to be
                lived and practised, transforming professional competence into Green Practice.&rdquo;
              </h3>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-button text-secondary"
              >
                <span className="border-b border-secondary group-hover:border-transparent">
                  Discover Our Philosophy
                </span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-0">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
                <img
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  alt="A young professional holding a seedling in cupped hands"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPuO2cmF5U1z045eG9JdN0DBd-44rt09XhI9k0gNAUmryBKJqDImqedxdqodksu1hLnrYmdMLPQl2w3kU_LdXfNGKIQ4KNJFkdBJockUI1EUmBGPlFRdoiluYCMk7dy5LVSJNJZ_DB_ojr0FyAJ89R4EKHE04J-j97MXiay1Ta4GkE5vdx2xL94isKPIrpXqjZwJqg1RdyUOoSjHNUBMxPFe1Ir5Gy2tHJEkdgz1VR-OFV2aY7kXBR"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Frameworks bento */}
        <section className="container-max bg-surface-container-lowest px-margin-mobile py-section-gap md:px-margin-desktop">
          <div className="mb-16 md:w-1/2">
            <h2 className="label-caps mb-4 text-secondary">Our Foundation</h2>
            <h3 className="font-display text-headline-md text-on-surface md:text-headline-lg">
              Our Foundational Frameworks
            </h3>
          </div>
          <div className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-3">
            <Link
              to="/frameworks"
              className="group relative block overflow-hidden rounded-md border border-outline-variant/30 md:col-span-2"
            >
              <img
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Architectural blueprint overlaid with leaf veins"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAvmsEvySS1D_gI8CBM7l4_mmvCXDEYPOrDbqgubDB3tifdlN0_cEAPBLEqciPq_jw7J6drzAennU3e11JbCRV6Z3XYra9QqVWMfsf4Ea471Lx8PeQvQZsohTJn4iDHcMC5WNK3oPA8d9RYjqPWhQ-0OaZamioqTxoRfppwENEGnPerEli4Awp4gcVT8YmrlQk8TCni7ZJhpFSkXkrtp4-9mJs5YbYObeLQtTDNul3CYHJLoNIUuqR"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-8">
                <h4 className="mb-2 font-display text-headline-md text-surface-bright">
                  Sustainable Design
                </h4>
                <p className="text-body-md text-surface-variant">
                  Integrating environmental thinking into the core of professional architectures.
                </p>
              </div>
            </Link>

            <Link
              to="/frameworks"
              className="group relative block overflow-hidden rounded-md border border-outline-variant/30 bg-surface"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/5 transition-colors group-hover:bg-secondary/10">
                <span className="material-symbols-outlined text-6xl text-secondary">eco</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full border-t border-outline-variant/20 bg-surface-container-lowest/80 p-8 backdrop-blur-sm">
                <h4 className="font-display text-headline-sm text-primary">Green Competency</h4>
              </div>
            </Link>

            <Link
              to="/frameworks"
              className="group relative block overflow-hidden rounded-md border border-outline-variant/30 bg-primary"
            >
              <div className="absolute inset-0 z-10 flex w-full flex-col justify-end p-8">
                <h4 className="mb-4 font-display text-headline-sm text-surface-bright">
                  View All Frameworks
                </h4>
                <span className="inline-flex items-center gap-2 text-button text-secondary-fixed-dim">
                  Explore <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </Link>

            <Link
              to="/frameworks"
              className="group relative block overflow-hidden rounded-md border border-outline-variant/30 md:col-span-2"
            >
              <img
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Modern sustainable agricultural facility"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYmf5G5tMoJV7-y7BOfjjmbuCKnFdYhXT8Dro5R7nm3M4evyyhsrWaWJVthHrGPb9uF8v9XoO58i2jDfpHQv6ymm8RK67ppmMbl5i5fJdWMi4cm262QOayj0vOSSj6Gi7K5ukSPYnrv_sEY693QgoPHmy3WJ0yjWmN4wswyK8vDc8ySI9z-_bMGpIVhMutA0FQgVBIZ5bRqe8QcQSYwDL9SRfUBCjWcRUyic9v96jfuApg_5L3rdXc"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-8">
                <h4 className="mb-2 font-display text-headline-md text-surface-bright">
                  Economic Resilience
                </h4>
                <p className="text-body-md text-surface-variant">
                  Building pathways that ensure long-term viability and social accountability.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Schools preview */}
        <section className="container-max border-t border-outline-variant/20 px-margin-mobile py-section-gap md:px-margin-desktop">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="label-caps mb-4 text-secondary">Academic Centers</h2>
              <h3 className="font-display text-headline-md text-on-surface md:text-headline-lg">
                Centers of Excellence
              </h3>
            </div>
            <Link
              to="/schools"
              className="group inline-flex items-center gap-2 whitespace-nowrap text-button text-secondary"
            >
              <span className="border-b border-secondary group-hover:border-transparent">
                Explore Our Schools
              </span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {[
              {
                title: "School of Sustainable Professional Practice (SSPP)",
                body: "Elevating established careers with critical environmental competencies and strategic green leadership skills.",
                alt: "Professionals in discussion around a modern conference table",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeKL4Av13KVthhbWNPOjTSYovofTPW5b5Km7DNzgyfYTPRQKZ5waTS4VtKGdG_0HBVLgNQd4OlQ0WSd0iF8aotl7N2Q8S_NqwO4ygDQFaCyGmXYQHcdmn29zIVyURVwlJUjdjfZaqoWIbOH3mSDRnLMa-n2byLx8BRK-mdKmVtJaEy7bLtVNkUBLIFMkAkSBuKseiqP7DGH39sIT_NgJnoQ446qsyiMk5IB6o0kcVG6350REDp3iD_",
              },
              {
                title: "School of Community Based Green Skilling",
                body: "Empowering local leaders and organizations with practical, localized knowledge to drive sustainable change at the grassroots.",
                alt: "Community workshop with hands-on learning outdoors",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVrMkDjGLeDWpp41VlYR9Qve98r0TIvlrfKJw6_3D9zVPwdz_NhKSaUS82ZkTByoAZzfYA8JFiMG2_QTLraExPnZQwt2JFeCya-V76lhNgIax10TG0FR9g2JFl879fo_TexcA6UA0EhJBXHMnYd4R8E_oSu1OhuHThCLsmCi6Wv_vedHNqTiR-BKrfqvuah8-rXhai-xxmF4dsVYgn9aWfFVR4V5ini5AorRe2BGeSDBApjaq6wff-",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group flex flex-col overflow-hidden rounded-md border border-outline-variant/30 bg-surface"
              >
                <div className="h-72 overflow-hidden">
                  <img
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={s.alt}
                    src={s.img}
                  />
                </div>
                <div className="flex flex-grow flex-col justify-between p-8">
                  <div>
                    <h4 className="mb-4 font-display text-headline-sm text-on-surface">
                      {s.title}
                    </h4>
                    <p className="mb-8 text-body-md text-on-surface-variant">{s.body}</p>
                  </div>
                  <Link
                    to="/schools"
                    className="inline-flex items-center gap-2 self-start text-button text-secondary"
                  >
                    Learn about our Schools{" "}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery split */}
        <section className="bg-surface-container py-section-gap">
          <div className="container-max px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 overflow-hidden rounded-md border border-outline-variant/30 bg-surface md:grid-cols-2">
              <div className="flex flex-col justify-center p-12 md:p-16">
                <h2 className="label-caps mb-4 text-secondary">How You Learn</h2>
                <h3 className="mb-6 font-display text-headline-md text-on-surface">
                  Delivery Mode
                </h3>
                <p className="mb-8 max-w-md text-body-md text-on-surface-variant">
                  Programs are delivered 100% online, but candidates who wish to have face to face
                  sessions are also welcome. Our short courses run for 12 weeks with live classes in
                  between.
                </p>
                <ul className="mb-10 space-y-4 text-body-md text-on-surface">
                  {["Fully online cohorts", "Optional face-to-face sessions", "Live classes in between"].map(
                    (i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary">
                          check_circle
                        </span>
                        {i}
                      </li>
                    ),
                  )}
                </ul>
                <Link
                  to="/delivery"
                  className="inline-flex items-center justify-center self-start rounded-md border border-primary px-6 py-3 text-button text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  Explore Modalities
                </Link>
              </div>
              <div className="relative h-96 overflow-hidden md:h-auto">
                <img
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  alt="Laptop on a wooden desk beside a potted succulent"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjVcFRiTC0t6s9kQY0biZqdgy4rUOyj87zDYLNRVL-do0WIhMrZ733YGCGK0EDUW2739jay3SaoJiPGDWDvMDYobC62kQVbJPi-BvFVDCN7OdO8jksRGbwkAS6JucwoqXDNux2_8TW10EgVvqToKYidXTpVlfh3AhIjL08s6fRHGZ4i_Iz9IlIOZI8GTl7z_r1P2IAUumxnLI7njqNv5Zn5vxY7eBa5Vkb3fmmAX6KQtMmuYbPaLb8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="container-max grid grid-cols-1 gap-gutter px-margin-mobile py-section-gap md:grid-cols-2 md:px-margin-desktop">
          <div className="flex flex-col items-center justify-center rounded-md border border-outline-variant/30 bg-surface p-12 text-center">
            <span className="material-symbols-outlined mb-6 text-5xl text-secondary">
              menu_book
            </span>
            <h3 className="mb-4 font-display text-headline-sm text-on-surface">
              Start Your Journey
            </h3>
            <p className="mb-8 max-w-sm text-body-md text-on-surface-variant">
              To apply for any of our programs, view the catalogue and follow the application steps.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center justify-center rounded-md bg-secondary px-8 py-3 text-button text-on-secondary transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
            >
              View Catalogue &amp; Apply
            </Link>
          </div>
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-md bg-primary p-12 text-center">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl text-surface-bright">
                account_balance
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="material-symbols-outlined mb-6 text-5xl text-secondary-fixed-dim">
                workspace_premium
              </span>
              <h3 className="mb-4 font-display text-headline-sm text-surface-bright">
                Investment in Excellence
              </h3>
              <p className="mb-8 max-w-sm text-body-md text-surface-variant/80">
                Learn about our special fees, grant &amp; instalment payment plan tailored to
                support your professional growth.
              </p>
              <Link
                to="/fees"
                className="inline-flex items-center justify-center rounded-md bg-secondary-container px-8 py-3 text-button text-on-secondary-fixed transition-colors hover:bg-surface-bright hover:text-primary"
              >
                Review Financial Plans
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
