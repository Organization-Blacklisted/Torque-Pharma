
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import SectionHeader from "@/components/ui/SectionHeading";
import StatCard from "@/components/ui/StatCard";
import MobileSlider from "@/components/ui/MobileSlider";

import { ManufacturingStatsSectionProps } from "./ManufacturingStatsSection.types";

export default function ManufacturingStatsSection({
  eyebrow,
  title,
  description,
  stats,
}: ManufacturingStatsSectionProps) {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
            variant="split"
          title={title}
          description={description}
        />

        <MobileSlider
          className="mt-10"
          desktopClassName="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </MobileSlider>
      </Container>
    </Section>
  );
}