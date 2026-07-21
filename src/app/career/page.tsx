import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import QuoteSection from "@/components/sections/shared/QuoteSection";
import CareerFormSection from "@/components/sections/career/CareerFormSection";
import WhyJoinSection from "@/components/sections/career/WhyJoinSection";
import CareerTopSection from "@/components/sections/career/CareerTopSection";
import OpenPositionsSection from "@/components/sections/career/OpenPositionsSection";
// Temporarily hidden per client — component, career.ts `experts` mapping and data kept.
// import CareerExpertsSection from "@/components/sections/career/CareerExpertsSection";
import CareerCtaButton from "@/components/sections/career/CareerCtaButton";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqSection from "@/components/sections/shared/FaqSection";
import { getCareerPage } from "@/lib/api/career";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Torque Pharma and be part of a team dedicated to making quality healthcare more accessible across the world.",
};

export default async function CareerPage() {
  // `experts` still returned by getCareerPage — omitted here while the section is hidden.
  const { topSection, whyJoin, openPositions, faq, cta, testimonial, form } = await getCareerPage();

  return (
    <>
      <Section first>
        <Container size="wide">
          <CareerTopSection {...topSection} />
        </Container>
      </Section>

      <Section>
        <WhyJoinSection {...whyJoin} className="mx-2" />
      </Section>

      <Section>
        <Container size="standard">
          <OpenPositionsSection {...openPositions} />
        </Container>
      </Section>

      <div id="roles-opening" style={{ scrollMarginTop: "100px" }}>
        <Section>
          <Container size="reading">
            <CareerFormSection title={form.title} disclaimer={form.disclaimer} />
          </Container>
        </Section>
      </div>

      {/* Experts section hidden per client. To re-add: restore the import, add
          `experts` back to the destructure above, and uncomment this block.
      <Section>
        <Container size="content">
          <CareerExpertsSection {...experts} />
        </Container>
      </Section>
      */}

      <Section>
        <Container size="standard">
          <QuoteSection quote={testimonial.quote} attribution={testimonial.attribution} />
        </Container>
      </Section>

      <FaqSection {...faq} />

      <CtaSection eyebrow={cta.eyebrow} title={cta.title}>
        <CareerCtaButton label={cta.button.label} />
      </CtaSection>
    </>
  );
}
