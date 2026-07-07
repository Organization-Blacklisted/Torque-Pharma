import type { Metadata } from "next";
import { getWhiteLabelPage } from "@/lib/api/white-label";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import ConnectSection from "@/components/sections/shared/ConnectSection";
import WhiteLabelPartnerSection from "@/components/sections/white-label/WhiteLabelPartnerSection";
import CertificationsSection from "@/components/sections/manufacturing/CertificationsSection";
import ProductionScaleSection from "@/components/sections/manufacturing/ProductionScaleSection";
import Accordion from "@/components/ui/Accordion";
import CTA from "@/components/ui/CTA";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export const metadata: Metadata = {
  title: "White Label Manufacturing | Torque Pharma",
  description:
    "Launch your product line quickly using our established, compliant medicine bases — shelf-ready pharmaceuticals under your brand name.",
};

export default async function WhiteLabelManufacturingPage() {
  const { hero, scale, partnering, partner, productionScale, connect, compliance, faq, cta } = await getWhiteLabelPage();

  return (
    <>
      <Section first>
        <Container size="xl">
          <ContentMediaSection
            {...hero}
            headerClassName="max-w-[1200px] mx-auto"
          />
        </Container>
      </Section>
      <Section padded className="bg-white/50">
        <Container size="wide">
          <SectionHeader
            eyebrow={scale.eyebrow}
            title={scale.heading}
            description={scale.description}
            variant="split"
            className="[&>div:first-child]:lg:col-span-5 [&>div:last-child]:lg:col-span-7"
          />
        </Container>
      </Section>
      <Section>
        <Container size="wide">
          <FeatureGridSection {...partnering} />
        </Container>
      </Section>
      <Section>
        <WhiteLabelPartnerSection {...partner} className="mx-2" />
      </Section>

      <ProductionScaleSection {...productionScale} />

      <Section padded className="bg-dark-blue">
        <Container size="xl">
          <ConnectSection variant="white-label" {...connect} />
        </Container>
      </Section>
      <Section>
        <Container size="reading">
          <CertificationsSection {...compliance} />
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
