import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import CTA from "@/components/ui/CTA";
import { SplitButton } from "@/components/ui/SplitButton";
import QuoteSection from "@/components/sections/shared/QuoteSection";
import CareerFormSection from "@/components/sections/career/CareerFormSection";
import WhyJoinSection from "@/components/sections/career/WhyJoinSection";
import CareerTopSection from "@/components/sections/career/CareerTopSection";
import { getCareerPage } from "@/lib/api/career";

export const metadata: Metadata = {
  title: "Careers | Torque Pharma",
  description: "Join Torque Pharma and be part of a team dedicated to making quality healthcare more accessible across the world.",
};

export default async function CareerPage() {
  const { topSection, whyJoin, faq, cta, testimonial, form } = await getCareerPage();

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
        <Container size="reading">
          <CareerFormSection title={form.title} disclaimer={form.disclaimer} />
        </Container>
      </Section>

      <Section>
        <Container size="standard">
          <QuoteSection quote={testimonial.quote} attribution={testimonial.attribution} />
        </Container>
      </Section>
      <Section>
        <Container size="reading">
          <SectionHeader
            eyebrow={faq.heading}
            title={faq.subTitle}
            align="center"
            className="mb-12"
          />
          <Accordion items={faq.items} />
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
