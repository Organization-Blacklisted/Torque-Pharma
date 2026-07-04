import FeatureCard from "@/components/ui/FeatureCard";
import SectionHeader from "@/components/ui/SectionHeading";
import type { FeatureGridSectionProps } from "./FeatureGridSection.types";

export default function FeatureGridSection({
  eyebrow,
  title,
  items,
  className = "",
}: FeatureGridSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        align="center"
        size="h2"
        className="mb-[var(--spacing-section-inner)]"
      />
      <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <FeatureCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            variant="light"
          />
        ))}
      </div>
    </div>
  );
}
