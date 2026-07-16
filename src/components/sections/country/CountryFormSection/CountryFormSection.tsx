"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeading";
import type { CountryFormSectionProps } from "./CountryFormSection.types";

const CountryForm = dynamic(() => import("./CountryForm"), { ssr: false });

export default function CountryFormSection({
  eyebrow,
  heading,
  image,
  pageName,
  pageUrl,
  className = "",
}: CountryFormSectionProps) {
  return (
    <div id="form_sect" className={className}>
      <div className="mx-auto mb-[var(--spacing-subsection)] max-w-[1100px]">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          align="center"
          size="h2"
        />
      </div>
      <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-auto">
          <Image
            src={image}
            alt={heading}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <CountryForm pageName={pageName} pageUrl={pageUrl} />
      </div>
    </div>
  );
}
