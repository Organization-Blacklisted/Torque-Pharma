import Image from "next/image";
import type { EventGallerySectionProps } from "./EventGallerySection.types";

export default function EventGallerySection({ section, className = "" }: EventGallerySectionProps) {
  const hasImages = section.items.length > 0;

  return (
    <div className={className}>
      <h2 className="mb-8 font-heading text-h2 font-light text-primary">{section.title}</h2>

      {hasImages ? (
        <div className="grid grid-cols-2 gap-[var(--spacing-gutter)]">
          {section.items.map((item, i) => (
            <div
              key={item.image}
              className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={item.image}
                alt={`Gallery photo ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-[#C6CCD8] bg-surface/50">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mb-4 text-secondary/30"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-body text-body font-medium text-secondary/50">Photos coming soon</p>
          <p className="mt-1 font-body text-body-sm text-secondary/40">Event gallery will be updated shortly</p>
        </div>
      )}
    </div>
  );
}
