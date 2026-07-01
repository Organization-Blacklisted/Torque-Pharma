import FeatureCard from "@/components/ui/FeatureCard";
import CTACard from "@/components/ui/CTACard";
import SectionHeader from "@/components/ui/SectionHeading";
import type { ValuesSectionProps } from "./ValuesSection.types";

export default function ValuesSection({
  eyebrow,
  subTitle,
  items,
  cta,
  className = "",
}: ValuesSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={subTitle}
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
            description={item.desc}
            variant="light"
          />
        ))}
        <CTACard title={cta.desc} linkLabel={cta.buttonText} href={cta.buttonLink} />
      </div>
    </div>
  );
}
