"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeading";
import type { ConnectSectionProps } from "./ConnectSection.types";

const ConnectForm = dynamic(() => import("../ConnectForm"), { ssr: false });

export default function ConnectSection({
  eyebrow,
  subTitle,
  image,
  className = "",
}: ConnectSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={subTitle}
        align="center"
        size="h2"
        className="mb-[var(--spacing-section-inner)]"
      />
      <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={subTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <ConnectForm />
      </div>
    </div>
  );
}
