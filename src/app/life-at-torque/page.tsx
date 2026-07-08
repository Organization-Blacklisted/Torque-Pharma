import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import CTA from "@/components/ui/CTA";
import { SplitButton } from "@/components/ui/SplitButton";
import QuoteSection from "@/components/sections/shared/QuoteSection";
import QualityAssessmentSection from "@/components/sections/manufacturing/QualityAssessmentSection";
import { getLifeAtTorquePage } from "@/lib/api/life-at-torque";

export const metadata: Metadata = {
  title: "Life at Torque | Torque Pharma",
  description: "Culture, careers, and life inside Torque Pharma.",
};

export default async function LifeAtTorquePage() {
  const { findRole, testimonial, cta } = await getLifeAtTorquePage();

  return (
    <>
      <QualityAssessmentSection title={findRole.title} items={findRole.items} containerSize="reading" />

      <Section>
        <Container size="standard">
          <QuoteSection quote={testimonial.quote} attribution={testimonial.attribution} />
        </Container>
      </Section>

      <Section as="div">
        <Container size="wide">
          <CTA eyebrow={cta.eyebrow} title={cta.title} variant="gradient">
            <SplitButton variant="secondary" href={cta.button.href}>
              {cta.button.label}
            </SplitButton>
          </CTA>
        </Container>
      </Section>
    </>
  );
}
