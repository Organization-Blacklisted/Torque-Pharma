import Image from "next/image";
import Link from "next/link";
import type { BrandCardProps } from "./BrandCard.types";

function VisitSiteArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
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

export default function BrandCard({
  category,
  pillColor,
  logo,
  productImage,
  description,
  brandName,
  href = "#",
  className = "",
}: BrandCardProps) {
  return (
    <div
      className={`group relative aspect-[402/403] overflow-hidden rounded-lg outline-none ${className}`}
      tabIndex={0}
    >
      {/* Default state */}
      <div className="absolute inset-0 flex flex-col bg-white/60 p-6 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
        <div className="flex justify-center">
          <span
            className="inline-block rounded-full border px-3 py-1 text-body-sm font-normal uppercase tracking-wide"
            style={{ borderColor: pillColor, color: pillColor }}
          >
            {category}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Image
            src={logo}
            alt={brandName}
            width={220}
            height={100}
            className="h-auto w-auto object-contain"
          />
        </div>
        <p className="mx-auto max-w-[220px] text-center text-h5 leading-6 text-secondary">
          {description}
        </p>
      </div>

      {/* Hover state */}
      <div className="absolute inset-0 flex flex-col bg-white p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Image
            src={productImage}
            alt={brandName}
            width={280}
            height={280}
            className="max-h-full w-auto object-contain"
          />
        </div>
        <div className="flex shrink-0 items-center justify-between">
          <span
            className="inline-block rounded-full border px-3 py-1 text-body-sm font-normal uppercase tracking-wide"
            style={{ borderColor: pillColor, color: pillColor }}
          >
            {brandName}
          </span>
          <Link
            href={href}
            className="flex items-center gap-1.5 text-body-sm font-medium uppercase tracking-wide text-mint"
          >
            Visit Site <VisitSiteArrow />
          </Link>
        </div>
      </div>
    </div>
  );
}
