import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const ONLINE_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuClYbmmfGIn2IW0iARyHr1SSMOJYhHS3ANGhBP2xrTjAwBVQFnXP80uub4tzy__KM7N1JQuamNXiDo_ff1aW_xWzaSj7_tHiRXsaZ95wsjL7YdQbmMuy0xRExU0o7KslXGL5mvrLVXrsrSdfdAhhdq7URkQaw-sPowcSifJGtXDp6wCcA2sF3h0jolPQTjBWERYRnlTxJ3SBgA26lmzxxNXcmyT9Xb1JenAIKx6vZPBX9xkhLTruup1";
const SEMINAR_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBEnrQfMPa2cTKZw78P4dnh5mu74NvurA9ADScAWX_QymiCjZ2RF7O6nczCmqqOIKon4WHXkK8q3JlaaEQvu3mEeESqIV5nTanXlJGFIh-uRiZfaY85DFwStWJ5ENujGkc7zSDXdopsGX05LkwBkrddiKli3GE3u-f1VwSy-D0MBt0Sz9U8-5x-QjMAPQo1vgA6dIv6gbnnfcttKhNFcVk_MNifo3Kh5Jpiq_xLjleAn0ZuZolTrAD4";
const VIRTUAL_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBkfB4wK6MZJPnTVJ7g0imrezzNDWcKm7ES8nujoY3ryR5jOqoTjZKSt9O_7fy7A-Rn922Mg44KYDC14eY-0PN_VUMIEeeYCQzNDnZdXzye49TI7G3EPPW4bCghhV13tG9ngLrMWrQ0-zNzgAjkvJfwK020FJMmBAuVHZLwB1G8NfQLGFPJfaKPnF76vtm94tmyaHYxa698rCXswD5Qyt_rNmQDaXdX4NYPnihNQc_EKxUB7ILxsjNz";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery Mode | S-STC" },
      {
        name: "description",
        content:
          "S-STC programs are delivered 100% online with optional face-to-face sessions. Short courses run for 12 weeks with live classes in between.",
      },
      { property: "og:title", content: "Delivery Mode — S-STC" },
      {
        property: "og:description",
        content:
          "Flexible online learning with live classes and optional in-person sessions for S-STC candidates.",
      },
      { property: "og:image", content: ONLINE_IMG },
      { name: "twitter:image", content: ONLINE_IMG },
      { property: "og:url", content: "https://sstc.co.ke/delivery" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Delivery Mode \u2014 S-STC" },
      { name: "twitter:description", content: "S-STC programs are delivered 100% online with optional face-to-face sessions. Short courses run for 12 weeks with live classes in between." },
    ],
    links: [{ rel: "canonical", href: "https://sstc.co.ke/delivery" }],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-grow pt-20">
        <section className="container-max px-margin-mobile py-section-gap md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="space-y-8 md:col-span-6">
              <span className="label-caps block text-secondary">S-STC Education</span>
              <h1 className="font-display text-display-lg text-primary">Delivery Mode</h1>
              <p className="border-l-2 border-secondary pl-6 text-body-lg text-on-surface-variant">
                Programs are delivered 100% online but candidates who wish to have face to face are
                also welcome. Communicate your preference through info@sstc.co.ke
              </p>
              <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-8">
                <p className="mb-6 text-body-md text-on-surface">
                  Depending on the program, our short courses are 12 weeks long with live classes in
                  between.
                </p>
                <a
                  href="https://sstc.co.ke"
                  className="group inline-flex items-center text-button text-secondary"
                >
                  sstc.co.ke
                  <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            <div className="grid h-[600px] grid-cols-2 gap-4 md:col-span-6">
              <div className="h-full overflow-hidden rounded-xl shadow-sm">
                <img
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  alt="A professional engaged in focused online learning on a laptop"
                  src={ONLINE_IMG}
                />
              </div>
              <div className="grid h-full grid-rows-2 gap-4">
                <div className="overflow-hidden rounded-xl shadow-sm">
                  <img
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="A small face-to-face seminar discussing environmental frameworks"
                    src={SEMINAR_IMG}
                  />
                </div>
                <div className="overflow-hidden rounded-xl shadow-sm">
                  <img
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="A live virtual class session with global participants"
                    src={VIRTUAL_IMG}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
