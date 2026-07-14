import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { EventHeroSectionProps } from "./EventHeroSection.types";

export default function EventHeroSection({ event, className = "" }: EventHeroSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={event.sub_title}
        title={event.title}
        description={event.desc_text}
        align="center"
        as="h1"
        size="h1"
        className="mb-8 w-full"
      />

      {event.featured_image && (
        <div className="relative aspect-[1280/600] w-full overflow-hidden rounded-xl">
          <Image
            src={event.featured_image}
            alt={event.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
