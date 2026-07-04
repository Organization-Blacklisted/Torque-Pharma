"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import SectionHeader from "@/components/ui/SectionHeading";
import type { ConnectSectionProps } from "./ConnectSection.types";

const ConnectForm = dynamic(() => import("./ConnectForm"), { ssr: false });

export default function ConnectSection({
  variant,
  eyebrow,
  title,
  image,
  className = "",
}: ConnectSectionProps) {
  const isDark = variant === "white-label";

  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        align="center"
        size="h2"
        theme={isDark ? "dark" : "light"}
        eyebrowColor={isDark ? "text-white" : "text-primary"}
        className="mb-[var(--spacing-section-inner)]"
      />
      <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <ConnectForm variant={variant} />
      </div>
    </div>
  );
}
