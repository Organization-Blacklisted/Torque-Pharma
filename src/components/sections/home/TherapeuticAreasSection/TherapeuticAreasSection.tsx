import SectionHeader from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import type { TherapeuticAreasSectionProps } from "./TherapeuticAreasSection.types";

export default function TherapeuticAreasSection({
  data: { eyebrow, heading, description, items, cta },
  className = "",
}: TherapeuticAreasSectionProps) {
  return (
    <div className={className}>
      <Container size="wide">
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        variant="split"
        theme="light"
        size="h2"
        headingClassName="max-w-[715px]"
        className="mb-[var(--spacing-subsection)]"
      />

      <div className="grid grid-cols-2 gap-[var(--spacing-gutter)] md:grid-cols-4">
        {items.map((item) => (
          <CategoryCard
            key={item.title}
            image={item.image}
            title={item.title}
            href={item.href}
          />
        ))}
      </div>

      <div className="mt-[var(--spacing-subsection)] flex justify-center">
        <SplitButton variant="primary" href={cta.href}>
          {cta.label}
        </SplitButton>
      </div>
      </Container>
    </div>
  );
}
