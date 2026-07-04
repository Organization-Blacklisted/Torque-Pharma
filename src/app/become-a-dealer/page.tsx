import type { Metadata } from "next";
import { getDealerPage } from "@/lib/api/dealer";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import Accordion from "@/components/ui/Accordion";
import CTA from "@/components/ui/CTA";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export const metadata: Metadata = {
  title: "Become a Dealer | Torque Pharma",
  description:
    "Partner with Torque Pharma to access a diverse product portfolio, dependable supply, and the support needed to grow confidently in your market.",
};

export default async function BecomeADealerPage() {
  const { banner, benefits, cta, faq } = await getDealerPage();

  return (
    <>
      <Section first>
        <Container size="xl">
          <ContentMediaSection
            {...banner}
            headerClassName="max-w-[1200px] mx-auto"
          />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <FeatureGridSection {...benefits} />
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

      <Section>
        <Container size="reading">
          <SectionHeader
            eyebrow={faq.eyebrow}
            title={faq.heading}
            description={faq.description}
            align="center"
            className="mb-12"
          />
          <Accordion items={faq.items} />
        </Container>
      </Section>
    </>
  );
}
