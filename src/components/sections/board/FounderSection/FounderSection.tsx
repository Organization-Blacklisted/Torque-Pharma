import Image from "next/image";
import SafeHtml from "@/components/ui/SafeHtml";
import type { FounderSectionProps } from "./FounderSection.types";

function QuoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="13" fill="#DEE7F3" />
      <g transform="translate(4, 4)">
        <path d="M3.52188 13.2746C2.77188 12.4496 2.32187 11.5496 2.32187 10.0496C2.32187 7.42461 4.19687 5.09961 6.82188 3.89961L7.49687 4.87461C5.02187 6.22461 4.49687 7.94961 4.34687 9.07461C4.72187 8.84961 5.24687 8.77461 5.77188 8.84961C7.12188 8.99961 8.17187 10.0496 8.17187 11.4746C8.17187 12.1496 7.87187 12.8246 7.42188 13.3496C6.89687 13.8746 6.29687 14.0996 5.54687 14.0996C4.72187 14.0996 3.97188 13.7246 3.52188 13.2746ZM11.0219 13.2746C10.2719 12.4496 9.82188 11.5496 9.82188 10.0496C9.82188 7.42461 11.6969 5.09961 14.3219 3.89961L14.9969 4.87461C12.5219 6.22461 11.9969 7.94961 11.8469 9.07461C12.2219 8.84961 12.7469 8.77461 13.2719 8.84961C14.6219 8.99961 15.6719 10.1246 15.6719 11.4746C15.6719 12.1496 15.3719 12.8246 14.9219 13.3496C14.3969 13.8746 13.7969 14.0996 13.0469 14.0996C12.2219 14.0996 11.4719 13.7246 11.0219 13.2746Z" fill="#1B2978"/>
      </g>
    </svg>
  );
}

export default function FounderSection({
  image,
  name,
  dates,
  quote,
  bio,
  className = "",
}: FounderSectionProps) {
  return (
    <div className={`rounded-lg border-[3px] border-gold-vivid p-10 grid gap-[var(--spacing-column-gap)] items-center lg:grid-cols-[1fr_1.2fr] ${className}`}>
      {/* Image */}
      <div className="rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="w-full h-auto"
        />
      </div>

      {/* Text */}
      <div>
        <h2 className="font-body text-[24px] font-medium leading-normal text-primary uppercase mb-4">
          {name}
        </h2>
        <p className="font-body text-body-sm italic text-secondary mb-[var(--spacing-subsection)]">
          {dates}
        </p>

        {/* Blockquote */}
        <blockquote className="relative mb-[var(--spacing-subsection)] w-fit border-l-[3px] border-gold-vivid rounded-t-lg bg-[#E9EFF7] py-6 pl-6 pr-14">
          <div className="absolute -top-[13px] -left-[13px]">
            <QuoteIcon />
          </div>
          <p className="font-body text-body font-medium italic text-[#0A1D4B]">{quote}</p>
        </blockquote>

        {/* Rich-text bio */}
        <SafeHtml
          html={bio}
          className="font-body text-body text-secondary [&_p]:mb-4 [&_p:last-child]:mb-0 [&_b]:font-medium [&_b]:text-secondary"
        />
      </div>
    </div>
  );
}
