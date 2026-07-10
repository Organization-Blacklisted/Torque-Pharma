"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeading";
import type { GpFormSectionProps } from "./GpFormSection.types";

const GpGlobalForm = dynamic(() => import("./GpGlobalForm"), { ssr: false });

export default function GpFormSection({
  eyebrow,
  heading,
  image,
  className = "",
}: GpFormSectionProps) {
  return (
    <div className={className}>
      <div className="mx-auto mb-[var(--spacing-section-inner)] max-w-[800px]">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          align="center"
          size="h2"
          theme="light"
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
        <GpGlobalForm />
      </div>
    </div>
  );
}
