import SectionHeader from "@/components/ui/SectionHeading";

import { StatsMediaSectionProps } from "./StatsMediaSection.types";

export default function StatsMediaSection({
  eyebrow,
  title,
  description,
  children,
  footer,
  className = "",
}: StatsMediaSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        variant="split"
      />

      <div className="mt-[var(--spacing-subsection)]">
        {children}
      </div>

      {footer && (
        <div className="mt-[var(--spacing-subsection)]">
          {footer}
        </div>
      )}
    </div>
  );
}