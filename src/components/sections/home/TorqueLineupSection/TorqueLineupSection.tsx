import BrandCard from "@/components/ui/BrandCard";
import SectionHeader from "@/components/ui/SectionHeading";
import type { TorqueLineupSectionProps } from "./TorqueLineupSection.types";

export default function TorqueLineupSection({
  data: { eyebrow, heading, description, items },
  className = "",
}: TorqueLineupSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        align="center"
        size="h2"
        className="mb-[var(--spacing-subsection)]"
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <BrandCard key={item.brandName} {...item} />
        ))}
      </div>
    </div>
  );
}
