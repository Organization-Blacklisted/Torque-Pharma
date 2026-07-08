"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { CareerExpertItem, CareerExpertsSectionProps } from "./CareerExpertsSection.types";

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M12.5 9.375L28.125 18.75L12.5 28.125V9.375Z" fill="#1B2978" stroke="#1B2978" strokeWidth="3.125" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect x="10" y="9" width="6" height="20" rx="2" fill="#1B2978" />
    <rect x="22" y="9" width="6" height="20" rx="2" fill="#1B2978" />
  </svg>
);

function ExpertCard({ name, designation, about, posterImage, video }: CareerExpertItem) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        {isPlaying && video ? (
          <video
            src={video}
            poster={posterImage}
            autoPlay
            className="h-full w-full object-cover"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <Image src={posterImage} alt={name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
        )}

        {video && (
          <button
            type="button"
            aria-label={isPlaying ? `Pause ${name}` : `Play ${name}`}
            onClick={() => setIsPlaying((p) => !p)}
            className="absolute bottom-4 right-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition-opacity hover:opacity-80"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>

      <div className="mt-4">
        <p className="font-heading text-h4 font-normal text-primary">{name}</p>
        <p className="mt-1 font-body text-body text-secondary">{designation}</p>
        <p className="mt-1 font-body text-body italic leading-6 text-primary/75">{about}</p>
      </div>
    </div>
  );
}

export default function CareerExpertsSection({
  eyebrow,
  heading,
  items,
  className = "",
}: CareerExpertsSectionProps) {
  return (
    <div className={className}>
      <SectionHeader eyebrow={eyebrow} title={heading} align="center" size="h2" className="mx-auto max-w-[800px]" />
      <div className="mt-[var(--spacing-subsection)] grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-3">
        {items.map((item) => (
          <ExpertCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
