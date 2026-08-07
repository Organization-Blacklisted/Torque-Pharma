import Image from "next/image";
import type { EventGallerySectionProps } from "./EventGallerySection.types";

export default function EventGallerySection({ section, className = "" }: EventGallerySectionProps) {
  return (
    <div className={className}>
      <h2 className="mb-8 font-heading text-h2 font-light text-primary">{section.title}</h2>

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
    </div>
  );
}
