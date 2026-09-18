import Image from "next/image";
import Link from "next/link";
import type { BrandShowcaseCardProps } from "./BrandShowcaseCard.types";

function VisitSiteArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5"
    >
      <path
        d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
      />
    </svg>
  );
}

export default function BrandShowcaseCard({
  badge,
  logo,
  featuredImage,
  ctaLabel,
  href,
  gradient,
  className = "",
}: BrandShowcaseCardProps) {
  return (
    <div
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-lg bg-[length:100%_100%] bg-[position:0%_0%] p-[var(--spacing-card)] transition-[background-size,background-position] duration-500 ease-out hover:bg-[length:130%_130%] hover:bg-[position:20%_20%] tablet:aspect-[650/330] tablet:flex-row tablet:gap-[2.875rem] ${className}`}
      style={{ backgroundImage: gradient }}
    >
      {/* Featured product image — on top below the tablet breakpoint, right-hand side from there up.
          Figma uses the same 284x293 image box across every brand at its reference width; we cap
          it at that size (max-width) but let it shrink below that so narrower cards never overflow. */}
      <div className="relative order-1 aspect-[4/3] w-full shrink-0 tablet:order-2 tablet:aspect-[284/293] tablet:h-auto tablet:w-[284px] tablet:shrink tablet:self-center">
        <Image
          src={featuredImage}
          alt={`${badge} product`}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-95"
          sizes="(min-width: 991px) 284px, 100vw"
        />
      </div>

      {/* Badge, logo, CTA — stacked in a column at every size */}
      <div className="relative order-2 flex min-w-0 flex-col items-center justify-between gap-4 text-center tablet:order-1 tablet:min-w-[200px] tablet:flex-1 tablet:items-start tablet:text-left">
        <div className="flex w-full flex-col items-center gap-3 tablet:items-start">
          <span className="inline-flex items-center rounded-full border border-white/30 px-4 py-1 text-body-sm font-normal uppercase  text-white tablet:whitespace-nowrap">
            {badge}
          </span>
          <div className="relative aspect-[250/114] w-full max-w-[150px] tablet:max-w-[250px]">
            <Image
              src={logo}
              alt={`${badge} brand logo`}
              fill
              className="object-contain tablet:object-left"
              sizes="250px"
            />
          </div>
        </div>

        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/visit inline-flex items-center gap-1.5 text-body-sm font-medium uppercase tracking-wide text-white"
        >
          <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 group-hover/visit:after:scale-x-100">
            {ctaLabel}
          </span>
          <VisitSiteArrow />
        </Link>
      </div>
    </div>
  );
}

