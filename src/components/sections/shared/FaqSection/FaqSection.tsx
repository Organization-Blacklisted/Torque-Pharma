import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import type { FaqSectionProps } from "./FaqSection.types";

export default function FaqSection({
  eyebrow,
  title,
  description,
  items,
  containerSize = "reading",
  className = "",
}: FaqSectionProps) {
  return (
    <Section className={className}>
      <Container size={containerSize}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          className="mb-12"
        />
        <Accordion items={items} />
      </Container>
    </Section>
  );
}
