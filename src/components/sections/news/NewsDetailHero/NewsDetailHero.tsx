import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { NewsDetailHeroProps } from "./NewsDetailHero.types";

export default function NewsDetailHero({ news, className = "" }: NewsDetailHeroProps) {
  const { title, sub_title, short_description, featured_image } = news;

  return (
    <div className={className}>
      <SectionHeader
        eyebrow={sub_title ?? undefined}
        title={title}
        description={short_description ?? undefined}
        align="center"
        as="h1"
        size="h1"
        className="mx-auto max-w-[1000px]"
      />

      {featured_image && (
        <div className="relative mt-[var(--spacing-section-inner)] aspect-[1064/471] w-full overflow-hidden rounded-xl bg-surface">
          <Image
            src={featured_image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
