import FeatureCard from "@/components/ui/FeatureCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import type { CountryEdgeSectionProps } from "./CountryEdgeSection.types";

export default function CountryEdgeSection({
  eyebrow,
  heading,
  cta,
  items,
  className = "",
}: CountryEdgeSectionProps) {
  return (
    <div className={className}>
      <Container size="wide">
        <div className="mx-auto max-w-[800px]">
          <SectionHeader
            eyebrow={eyebrow}
            title={heading}
            align="center"
            size="h2"
            className="mb-[var(--spacing-subsection)]"
          />
        </div>
        <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-[var(--spacing-subsection)] flex justify-center">
          <SplitButton href={cta.href} variant="primary">
            {cta.label}
          </SplitButton>
        </div>
      </Container>
    </div>
  );
}
