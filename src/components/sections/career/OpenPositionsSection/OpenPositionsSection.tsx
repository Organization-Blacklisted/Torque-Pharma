import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { OpenPositionItem, OpenPositionsSectionProps } from "./OpenPositionsSection.types";

function PositionCard({ image, title, description }: OpenPositionItem) {
  return (
    <div className="flex flex-1 flex-col rounded-lg bg-white/40 p-[var(--spacing-card)]">
      <Image src={image} alt="" width={48} height={48} aria-hidden className="mb-[var(--spacing-gutter)] object-contain" />
      <h3 className="mb-4 text-h4 font-normal leading-normal text-secondary">{title}</h3>
      <p className="text-h5 font-normal leading-6 text-secondary/50">{description}</p>
    </div>
  );
}

export default function OpenPositionsSection({
  eyebrow,
  heading,
  description,
  leftItems,
  centerItems,
  rightItems,
  className = "",
}: OpenPositionsSectionProps) {
  return (
    <div id="roles-opening" className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        align="center"
        size="h2"
        className="mx-auto max-w-[962px]"
      />
      <div className="mt-[var(--spacing-subsection)] grid gap-[var(--spacing-gutter)] md:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-[var(--spacing-gutter)]">
          {leftItems.map((item) => (
            <PositionCard key={item.title} {...item} />
          ))}
        </div>

        {/* Center column — photos, shows between card groups on mobile */}
        <div className="flex flex-col gap-[var(--spacing-gutter)] md:h-full">
          {centerItems.map((item, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-auto md:flex-1"
            >
              <Image src={item.image} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-[var(--spacing-gutter)]">
          {rightItems.map((item) => (
            <PositionCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
