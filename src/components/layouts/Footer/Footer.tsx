import Link from "next/link";
import Image from "next/image";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container/Container";
import { quickLinksCol1, quickLinksCol2, subBrandsCol1, subBrandsCol2, type NavLink } from "./footer.data";
import { socialLinks } from "./footer.icons";

// ─── Sub-components ──────────────────────────────────────────────────────────

function FooterNavColumn({ links }: { links: NavLink[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="font-body text-body-lg font-light text-white transition-colors duration-200 hover:text-mint"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-dark-blue text-white pb-subsection">
      <div className="border-x border-b border-white/20 mx-subsection">

        {/* CTA Band */}
        <div className="border-white/20">
          <Container size="wide">
            <div className="flex flex-col gap-6 py-section-inner-sm md:flex-row md:items-center md:justify-between">
              <div className="max-w-4xl">
                <h2 className="font-heading text-h2 font-light leading-[1.1] text-white">
                  Let's Work Together
                </h2>
                <p className="mt-3 font-body text-body-lg font-light text-white leading-6 max-w-[830px]">
                  Whether you are a distributor looking to bring trusted
                  pharmaceutical products to your market, a partner exploring
                  licensing or co-manufacturing opportunities, or simply want to
                  learn more about what Torque Pharma has to offer, we would love
                  to hear from you. Our team is ready to help.
                </p>
              </div>
              <SplitButton variant="primary" href="/contact-us" className="shrink-0 self-start lg:self-auto">
                Get in Touch
              </SplitButton>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <div className="border-t border-white/20">
          <Container size="wide">
            {/*
              mobile  (<768px)    — single column, stacked
              tablet  (768–1199px) — 2-col grid: brand spans full top row, QL + SB side-by-side
              desktop (1200px+)   — 3-col flex row with justify-between
            */}
            <div className="grid grid-cols-1 gap-10 pt-10 pb-14
                            md:grid-cols-2 md:gap-x-16 md:gap-y-12 md:items-start md:pt-14 md:pb-20
                            [@media(min-width:1200px)]:flex [@media(min-width:1200px)]:flex-row [@media(min-width:1200px)]:items-start [@media(min-width:1200px)]:justify-between">

              {/* Brand Column */}
              <div className="md:col-span-2 [@media(min-width:1200px)]:col-span-1 [@media(min-width:1200px)]:shrink-0 [@media(min-width:1200px)]:w-[clamp(280px,22vw,350px)]">
                <Link href="/">
                  <Image
                    src="/torque-white.svg"
                    alt="Torque"
                    width={220}
                    height={55}
                  />
                </Link>
                <address className="mt-6 not-italic font-body text-body-lg font-light text-white/80 ">
                  C-83, Industrial Area, Phase 7, Sector 74
                  Sahibzada Ajit Singh Nagar, Punjab 160055
                </address>
                <div className="mt-3 flex flex-col gap-4 font-body text-body-lg font-light text-white/80">
                  <a href="mailto:info@torquepharma.com">info@torquepharma.com</a>
                  <div className="flex flex-col gap-1">
                    <a href="tel:+911724991500">+91 172 499 1500</a>
                    <a href="tel:+911726730000">+91 172 673 0000</a>
                  </div>
                </div>
                <div className="mt-subsection">
                  <p className="font-body text-body-lg font-medium uppercase text-white/80">
                    Follow Us
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    {socialLinks.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="text-mint transition-opacity duration-200 hover:opacity-70"
                      >
                        <Icon className="flex shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <p className="mb-6 font-body text-body-lg font-medium uppercase text-white/80">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-x-2 [@media(min-width:1200px)]:gap-x-[clamp(1rem,3vw,5rem)]">
                  <FooterNavColumn links={quickLinksCol1} />
                  <FooterNavColumn links={quickLinksCol2} />
                </div>
              </div>

              {/* Sub Brands */}
              <div>
                <p className="mb-6 font-body text-body-lg font-medium uppercase text-white/80">
                  Sub Brands
                </p>
                <div className="grid grid-cols-2 gap-x-2 [@media(min-width:1200px)]:gap-x-[clamp(1rem,3vw,5rem)]">
                  <FooterNavColumn links={subBrandsCol1} />
                  <FooterNavColumn links={subBrandsCol2} />
                </div>
              </div>

            </div>
          </Container>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <Container size="wide">
            <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-6 justify-center md:justify-start">
                <Link
                  href="/privacy-policy"
                  className="font-body text-body-lg font-light text-white transition-colors duration-200 hover:text-mint"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="font-body text-body-lg font-light text-white transition-colors duration-200 hover:text-mint"
                >
                  Terms &amp; Conditions
                </Link>
              </div>
              <p className="font-body text-body-lg font-light text-white text-center md:text-right">
                Copyright &copy;2026 Torque Group, All Rights Reserved
              </p>
            </div>
          </Container>
        </div>

      </div>
    </footer>
  );
}
