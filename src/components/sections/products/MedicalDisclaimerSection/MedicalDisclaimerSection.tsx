import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import type { MedicalDisclaimerSectionProps } from "./MedicalDisclaimerSection.types";

export default function MedicalDisclaimerSection({
  disclaimer,
  className = "",
}: MedicalDisclaimerSectionProps) {
  return (
    <Section className={className}>
      <Container size="xl">
        <SectionHeader
          eyebrow="Medical Disclaimer"
          content={disclaimer}
          align="center"
        />
      </Container>
    </Section>
  );
}
