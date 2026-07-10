"use client";

import { useState } from "react";
import CertCard from "@/components/ui/CertCard";
import CertLightbox from "@/components/ui/CertLightbox";
import type { GpCertificationsSectionProps } from "./GpCertificationsSection.types";

export default function GpCertificationsSection({
  eyebrow,
  items,
  className = "",
}: GpCertificationsSectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems = items.map((item) => ({ image: item.image, label: item.title }));

  return (
    <div className={`flex flex-col items-center gap-10 text-center ${className}`}>
      <h2 className="font-heading text-h2 font-light text-primary">{eyebrow}</h2>

      <div className="grid grid-cols-2 gap-[var(--spacing-gutter)] md:grid-cols-4 w-full">
        {items.map((item, i) => (
          <CertCard
            key={i}
            image={item.image}
            label={item.title}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <CertLightbox
          items={lightboxItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((p) => (p !== null ? p - 1 : null))}
          onNext={() => setLightboxIndex((p) => (p !== null ? p + 1 : null))}
        />
      )}
    </div>
  );
}
