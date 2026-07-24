import NewsCard from "@/components/ui/NewsCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { RelatedNewsSectionProps } from "./RelatedNewsSection.types";

export default function RelatedNewsSection({ items, className = "" }: RelatedNewsSectionProps) {
  if (!items.length) return null;

  return (
    <div className={className}>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader eyebrow="Continue Reading" title="More From the Newsroom" />
        <div className="shrink-0">
          <SplitButton variant="primary" href="/news-and-media">
            See All News
          </SplitButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <NewsCard
            key={item.id}
            slug={item.slug}
            title={item.title}
            tag_image={item.tag_image}
            tag_text={item.tag_text}
            tag_link={item.tag_link}
            featured_image={item.featured_image}
            news_date={item.news_date}
          />
        ))}
      </div>
    </div>
  );
}
