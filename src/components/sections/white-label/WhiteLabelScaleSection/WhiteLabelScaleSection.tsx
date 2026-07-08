import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import type { WhiteLabelScaleSectionProps } from "./WhiteLabelScaleSection.types";

export default function WhiteLabelScaleSection({
  eyebrow,
  heading,
  description,
  className = "",
}: WhiteLabelScaleSectionProps) {
  return (
    <Section padded className={`bg-white/50 ${className}`}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          description={description}
          variant="split"
          className="[&>div:first-child]:lg:col-span-5 [&>div:last-child]:lg:col-span-7"
        />
      </Container>
    </Section>
  );
}
