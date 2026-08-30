import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/sstc-logo.jpg.asset.json";
import greeningAsset from "@/assets/greening-partnership.jpeg.asset.json";

export function SiteFooter() {
  return (
    <footer className="w-full bg-primary py-section-gap">
      <div className="container-max grid grid-cols-1 gap-gutter px-margin-mobile md:grid-cols-4 md:px-margin-desktop">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <img
              src={logoAsset.url}
              alt="SustainaSpace Training Center crest"
              className="h-20 w-20 rounded-full bg-surface-bright object-contain p-1 shadow-md md:h-24 md:w-24"
            />
            <img
              src={greeningAsset.url}
              alt="Greening Education Partnership logo"
              className="h-16 w-auto rounded bg-surface-bright object-contain p-1 shadow-md md:h-20"
            />
          </div>
          <p className="max-w-xs text-body-md text-surface-variant/80">
            Bridging the gap with sustainability learning pathways that complement existing
            qualifications.
          </p>
        </div>

        <div>
          <h4 className="label-caps mb-6 text-surface-variant">Contact</h4>
          <ul className="space-y-4 text-body-md">
            <li>
              <a
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
                href="https://sstc.co.ke"
              >
                sstc.co.ke
              </a>
            </li>
            <li>
              <a
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
                href="mailto:info@sstc.co.ke"
              >
                info@sstc.co.ke
              </a>
            </li>
          </ul>
        </div>


        <div>
          <h4 className="label-caps mb-6 text-surface-variant">Admissions</h4>
          <ul className="space-y-4 text-body-md">
            <li>
              <Link
                to="/apply"
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
              >
                How to Apply
              </Link>
            </li>
            <li>
              <Link
                to="/fees"
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
              >
                Fees &amp; Support
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
              >
                Other Services
              </Link>
            </li>
            <li>
              <Link
                to="/delivery"
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
              >
                Delivery Mode
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="label-caps mb-6 text-surface-variant">Legal</h4>
          <ul className="space-y-4 text-body-md">
            <li>
              <Link
                to="/privacy"
                className="text-surface-variant/80 transition-colors hover:text-secondary-fixed-dim"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface/10 pt-8 md:col-span-4 md:flex-row">
          <p className="text-body-md text-surface-variant/60">
            © 2026 SustainaSpace Training Center (S-STC). Shaping Green Practice.
          </p>
          <p className="text-body-md text-surface-variant/60">
            Powered by{" "}
            <a
              href="https://tecortech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-fixed-dim transition-colors hover:text-surface-bright"
            >
              Tecortech Systems
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
