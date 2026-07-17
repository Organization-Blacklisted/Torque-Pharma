import type { Metadata } from "next";
import { getWhiteLabelPage } from "@/lib/api/white-label";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import ConnectSection from "@/components/sections/shared/ConnectSection";
import WhiteLabelPartnerSection from "@/components/sections/white-label/WhiteLabelPartnerSection";
import CertificationsSection from "@/components/sections/manufacturing/CertificationsSection";
import ProductionScaleSection from "@/components/sections/manufacturing/ProductionScaleSection";
import WhiteLabelScaleSection from "@/components/sections/white-label/WhiteLabelScaleSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqSection from "@/components/sections/shared/FaqSection";

export const metadata: Metadata = {
  title: "White Label Manufacturing",
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
            headingAs="h1"
            headerClassName="max-w-[1200px] mx-auto"
          />
        </Container>
      </Section>
      <WhiteLabelScaleSection {...scale} />
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

      <FaqSection {...faq} />

      <CtaSection
        eyebrow={cta.eyebrow}
        title={cta.title}
        button={{ label: cta.button.label, href: cta.button.href }}
      />
    </>
  );
}
