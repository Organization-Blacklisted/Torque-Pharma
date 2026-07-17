import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import QuoteSection from "@/components/sections/shared/QuoteSection";
import QualityAssessmentSection from "@/components/sections/manufacturing/QualityAssessmentSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import LatTopSection from "@/components/sections/life-at-torque/LatTopSection";
import LatWorkplaceSection from "@/components/sections/life-at-torque/LatWorkplaceSection";
import LatBuiltOnSection from "@/components/sections/life-at-torque/LatBuiltOnSection";
import LatBeyondJobSection from "@/components/sections/life-at-torque/LatBeyondJobSection";
import AnimatedPill from "@/components/ui/AnimatedPill";
import SafeHtml from "@/components/ui/SafeHtml";
import { getLifeAtTorquePage } from "@/lib/api/life-at-torque";

export const metadata: Metadata = {
  title: "Life at Torque",
  description: "Culture, careers, and life inside Torque Pharma.",
};

export default async function LifeAtTorquePage() {
  const { top, workplace, builtOn, beyondJob, findRole, testimonial, cta } = await getLifeAtTorquePage();

  return (
    <>
      <LatTopSection
        eyebrow={top.eyebrow}
        title={top.title}
        description={top.description}
        button={top.button}
        gallery={top.gallery}
      />

      {top.shortDescription && (
        <Section>
          <Container size="wide">
            <AnimatedPill className="mx-auto w-fit">
              <SafeHtml
                html={top.shortDescription}
                className="text-center text-lead italic text-secondary leading-[1.5] [&_b]:not-italic [&_b]:font-medium [&_b]:text-primary max-w-[800px]"
              />
            </AnimatedPill>
          </Container>
        </Section>
      )}

      {workplace.items.length > 0 && (
        <LatWorkplaceSection
          eyebrow={workplace.eyebrow}
          title={workplace.title}
          description={workplace.description}
          items={workplace.items}
        />
      )}

      {builtOn.items.length > 0 && (
        <LatBuiltOnSection
          eyebrow={builtOn.eyebrow}
          title={builtOn.title}
          description={builtOn.description}
          items={builtOn.items}
        />
      )}

      {beyondJob.columns.length > 0 && (
        <LatBeyondJobSection
          eyebrow={beyondJob.eyebrow}
          title={beyondJob.title}
          columns={beyondJob.columns}
        />
      )}

      {testimonial.quote && (
        <Section>
          <Container size="standard">
            <QuoteSection quote={testimonial.quote} attribution={testimonial.attribution} />
          </Container>
        </Section>
      )}

      {findRole.items.length > 0 && (
        <QualityAssessmentSection title={findRole.title} items={findRole.items} containerSize="reading" />
      )}

      {cta.title && (
        <CtaSection
          eyebrow={cta.eyebrow}
          title={cta.title}
          button={{ label: cta.button.label, href: cta.button.href }}
        />
      )}
    </>
  );
}
