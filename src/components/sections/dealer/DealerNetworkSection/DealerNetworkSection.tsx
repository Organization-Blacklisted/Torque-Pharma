"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeading";
import type { DealerNetworkSectionProps } from "./DealerNetworkSection.types";

const DealerForm = dynamic(() => import("./DealerForm"), { ssr: false });

export default function DealerNetworkSection({
  eyebrow,
  heading,
  description,
  image,
  className = "",
}: DealerNetworkSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        eyebrowColor="text-white"
        title={heading}
        description={description}
        theme="dark"
        align="center"
        className="mb-[var(--spacing-section-inner)]"
      />
      <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-[2fr_3fr] md:items-start">
        <div className="overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={heading}
            width={600}
            height={450}
            className="w-full h-auto object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
        <DealerForm />
      </div>
    </div>
  );
}
