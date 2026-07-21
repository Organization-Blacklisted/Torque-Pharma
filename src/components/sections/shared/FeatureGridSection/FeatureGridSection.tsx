import FeatureCard from "@/components/ui/FeatureCard";
import MobileSlider from "@/components/ui/MobileSlider";
import SectionHeader from "@/components/ui/SectionHeading";
import type { FeatureGridSectionProps } from "./FeatureGridSection.types";

const GRID_CLASSES = "grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3";

export default function FeatureGridSection({
  eyebrow,
  title,
  items,
  className = "",
  mobileSlider = false,
}: FeatureGridSectionProps) {
  const cards = items.map((item) => (
    <FeatureCard
      key={item.title}
      icon={item.icon}
      title={item.title}
      description={item.description}
      variant="light"
    />
  ));

  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        align="center"
        size="h2"
        className="mb-[var(--spacing-section-inner)]"
      />
      {mobileSlider ? (
        <MobileSlider desktopClassName={GRID_CLASSES}>{cards}</MobileSlider>
      ) : (
        <div className={GRID_CLASSES}>{cards}</div>
      )}
    </div>
  );
}
