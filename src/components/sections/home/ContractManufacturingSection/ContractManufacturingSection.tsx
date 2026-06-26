import Container from "@/components/layouts/Container";
import FeatureCard from "@/components/ui/FeatureCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { ContractManufacturingSectionProps } from "./ContractManufacturingSection.types";

export default function ContractManufacturingSection({
  data: { eyebrow, heading, description, items, cta },
  className = "",
}: ContractManufacturingSectionProps) {
  return (
    <div className={`bg-dark-blue py-[var(--spacing-section-inner)] ${className}`}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          description={description}
          variant="split"
          theme="dark"
          size="h2"
          eyebrowColor="text-white"
        />

        <div className="mt-[var(--spacing-subsection)] grid gap-[var(--spacing-gutter)] md:grid-cols-3">
          {items.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

        <hr className="my-10 border-t border-white/20" />

        <div className="flex justify-center">
          <SplitButton variant="primary" href={cta.href}>
            {cta.label}
          </SplitButton>
        </div>
      </Container>
    </div>
  );
}
