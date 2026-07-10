import Container from "@/components/layouts/Container";
import FeatureCard from "@/components/ui/FeatureCard";
import SectionHeader from "@/components/ui/SectionHeading";
import type { GpTorqueModelSectionProps } from "./GpTorqueModelSection.types";

const HIGHLIGHTED = [2, 4, 7];

export default function GpTorqueModelSection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: GpTorqueModelSectionProps) {
  return (
    <div className={`rounded-lg bg-dark-blue py-[var(--spacing-section-inner)] ${className}`}>
      <Container size="standard">
        <div className="flex flex-col gap-[var(--spacing-subsection)]">
          <SectionHeader
            eyebrow={eyebrow}
            title={heading}
            description={description}
            theme="dark"
            align="center"
            eyebrowColor="text-white"
            size="h2"
          />
          <div className="grid grid-cols-2 gap-[var(--spacing-gutter)] md:grid-cols-4">
            {items.map((item, i) => (
              <FeatureCard
                key={item.title}
                icon={item.image}
                title={item.title}
                highlighted={HIGHLIGHTED.includes(i)}
                className="items-center text-center"
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
