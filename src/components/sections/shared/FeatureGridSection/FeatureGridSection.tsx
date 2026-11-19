import FeatureCard from "@/components/ui/FeatureCard";
import MobileSlider from "@/components/ui/MobileSlider";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { FeatureGridSectionProps } from "./FeatureGridSection.types";

const GRID_CLASSES = "grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3";

export default function FeatureGridSection({
  eyebrow,
  title,
  description,
  align = "center",
  items,
  button,
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
        description={description}
        align={align}
        size="h2"
        className="mb-[var(--spacing-section-inner)]"
      />
      {mobileSlider ? (
        <MobileSlider desktopClassName={GRID_CLASSES}>{cards}</MobileSlider>
      ) : (
        <div className={GRID_CLASSES}>{cards}</div>
      )}
      {button && (
        <div className="mt-[var(--spacing-section-inner)] flex justify-center">
          <SplitButton href={button.href} variant="primary">
            {button.label}
          </SplitButton>
        </div>
      )}
    </div>
  );
}
