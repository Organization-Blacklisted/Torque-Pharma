import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import StatCard from "@/components/ui/StatCard";
import MobileSlider from "@/components/ui/MobileSlider";
import type { AboutStatsSectionProps } from "./AboutStatsSection.types";

export default function AboutStatsSection({
  items,
  className = "",
}: AboutStatsSectionProps) {
  return (
    <Section className={className}>
      <Container>
        <MobileSlider desktopClassName="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 xl:grid-cols-4">
          {items.map((stat, i) => (
            <StatCard key={i} {...stat} animated />
          ))}
        </MobileSlider>
      </Container>
    </Section>
  );
}
