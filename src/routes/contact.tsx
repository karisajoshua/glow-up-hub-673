import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const COVER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDnmbf2HXEQpDP6EbzObWPBwZiPX8cGt8ESRNE6eHlfI8X1CFAj4cbrbJJESGpnu7-orSLJSMHIuKo-u9YwDCGcsmMoDFluoRg1EztNsBCQ00u7yBg5HFfx96u9A0g6GpnOFdf6VgLGtN3F5wCUv2iJ8NTQ3kl-U4NDP35hObyqdFfKXtbqzWuj6nlbuqO1I7pJZGFGvk348rwGBNSOWRdw3v3l8MW9QkdG3Kk7ItxCVADWWE5gKep4";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact S-STC | Get in Touch" },
      {
        name: "description",
        content:
          "Contact SustainaSpace Training Center for admissions, partnerships and media enquiries. Email info@sstc.co.ke or visit sstc.co.ke.",
      },
      { property: "og:title", content: "Get in Touch — S-STC" },
      {
        property: "og:description",
        content:
          "Inquiries from prospective students, institutional partners and global change-makers are welcome.",
      },
      { property: "og:image", content: COVER },
      { name: "twitter:image", content: COVER },
      { property: "og:url", content: "https://sstc.co.ke/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Get in Touch \u2014 S-STC" },
      { name: "twitter:description", content: "Contact SustainaSpace Training Center for admissions, partnerships and media enquiries. Email info@sstc.co.ke or visit sstc.co.ke." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://sstc.co.ke/"}, {"@type": "ListItem", "position": 2, "name": "Contact", "item": "https://sstc.co.ke/contact"}]}),
      },
    ],
  }),
  component: ContactPage,
});

const FIELD =
  "peer block w-full border-0 border-b border-outline bg-transparent px-0 py-3 text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-primary";

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container-max w-full flex-grow px-margin-mobile pb-section-gap pt-32 md:px-margin-desktop">
        <div className="mb-16 md:mb-24">
          <h1 className="mb-6 font-display text-display-lg text-primary md:text-display-xl">
            Get in Touch
          </h1>
          <p className="max-w-2xl text-body-lg text-on-surface-variant">
            We invite inquiries from prospective students, institutional partners, and global
            change-makers interested in advancing sustainable practices through rigorous academic
            training.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="flex flex-col gap-12 md:col-span-4">
            <div>
              <h2 className="label-caps mb-4 text-outline">Email</h2>
              <a
                href="mailto:info@sstc.co.ke"
                className="inline-block border-b border-secondary pb-1 text-body-lg text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                info@sstc.co.ke
              </a>
            </div>
            <div>
              <h2 className="label-caps mb-4 text-outline">Website</h2>
              <a
                href="https://sstc.co.ke"
                className="inline-block border-b border-secondary pb-1 text-body-lg text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                sstc.co.ke
              </a>
            </div>
            <div className="group relative mt-8 aspect-[4/5] w-full overflow-hidden border border-outline-variant/30">
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${COVER}')` }}
                role="img"
                aria-label="An academic building integrated with lush green foliage"
              />
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <div className="border border-outline-variant/20 bg-surface-bright p-8 md:p-12">
              <h2 className="mb-8 font-display text-headline-md text-primary">Send an Inquiry</h2>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const first = String(data.get("first_name") ?? "");
                  const last = String(data.get("last_name") ?? "");
                  const email = String(data.get("email") ?? "");
                  const type = String(data.get("inquiry_type") ?? "");
                  const message = String(data.get("message") ?? "");
                  const subject = `S-STC ${type} enquiry — ${first} ${last}`.trim();
                  const body = [
                    `Name: ${first} ${last}`,
                    `Email: ${email}`,
                    `Inquiry type: ${type}`,
                    "",
                    message,
                  ].join("\n");
                  window.location.href = `mailto:info@sstc.co.ke?subject=${encodeURIComponent(
                    subject,
                  )}&body=${encodeURIComponent(body)}`;
                  setSent(true);
                }}
              >

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <label className="label-caps mb-2 block text-outline" htmlFor="first_name">
                      First Name
                    </label>
                    <input id="first_name" name="first_name" type="text" required className={FIELD} />
                  </div>
                  <div>
                    <label className="label-caps mb-2 block text-outline" htmlFor="last_name">
                      Last Name
                    </label>
                    <input id="last_name" name="last_name" type="text" required className={FIELD} />
                  </div>
                </div>
                <div>
                  <label className="label-caps mb-2 block text-outline" htmlFor="email">
                    Email Address
                  </label>
                  <input id="email" name="email" type="email" required className={FIELD} />
                </div>
                <div>
                  <label className="label-caps mb-2 block text-outline" htmlFor="inquiry_type">
                    Inquiry Type
                  </label>
                  <select id="inquiry_type" name="inquiry_type" defaultValue="" required className={FIELD}>
                    <option value="" disabled>
                      Select Inquiry Type
                    </option>
                    <option value="admissions">Admissions</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="media">Media &amp; Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label-caps mb-2 block text-outline" htmlFor="message">
                    Message
                  </label>
                  <textarea id="message" name="message" rows={4} required className={`${FIELD} resize-none`} />
                </div>
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-button text-on-primary transition-colors hover:bg-secondary"
                  >
                    Open Inquiry in Email App
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </button>
                  <p className="text-body-sm text-secondary">
                    This prepares your message in your own email app — nothing is sent from this page until you press send there.
                  </p>
                </div>
                {sent && (
                  <p className="text-body-md text-secondary" role="status">
                    Your inquiry is prepared in your email app. Please press send there to deliver it. If your email app did not
                    open, write to info@sstc.co.ke directly.
                  </p>
                )}

              </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
