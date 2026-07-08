import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import AccreditationCard from "@/components/ui/AccreditationCard";
import type { GpExportCredentialsSectionProps } from "./GpExportCredentialsSection.types";

export default function GpExportCredentialsSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: GpExportCredentialsSectionProps) {
  return (
    <Section className={className}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          className="mx-auto mb-12 max-w-[1000px]"
        />
        <div className="flex flex-wrap justify-center gap-[var(--spacing-gutter)]">
          {items.map((item) => (
            <AccreditationCard
              key={item.title}
              image={item.image}
              title={item.title}
              desc={item.description}
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)]"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
