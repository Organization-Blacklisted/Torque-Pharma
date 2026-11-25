import type { Metadata } from "next";
import { getExportManufacturingPage } from "@/lib/api/export-manufacturing";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import ExmCapabilitiesSection from "@/components/sections/export-manufacturing/ExmCapabilitiesSection";
import ProductionScaleSection from "@/components/sections/manufacturing/ProductionScaleSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import ManufacturingProcessSection from "@/components/sections/manufacturing/ManufacturingProcessSection";
import WhyJoinSection from "@/components/sections/career/WhyJoinSection";
import ExmQualityChecklistSection from "@/components/sections/export-manufacturing/ExmQualityChecklistSection";
import FaqSection from "@/components/sections/shared/FaqSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import ManufacturingEnquiryProvider, { EnquiryTriggerButton } from "@/components/ui/ManufacturingEnquiryModal";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

const PAGE_NAME = "Export Manufacturing: Pharma & Ayurveda";
const PAGE_URL = "/export-manufacturing-pharma-ayurveda";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getExportManufacturingPage();
  return {
    title: seo.title ?? "Pharma & Ayurveda Export Manufacturing | Torque Pharma",
    description:
      seo.description ??
      "Explore pharmaceutical and Ayurvedic export manufacturing with Torque Pharma. Discover international third-party manufacturing, white label solutions and export documentation support.",
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    robots: seo.index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function ExportManufacturingPage() {
  const { hero, partnership, capabilities, dosage, international, process, brand, quality, faq, cta } =
    await getExportManufacturingPage();

  return (
    <ManufacturingEnquiryProvider pageName={PAGE_NAME} pageUrl={PAGE_URL}>
      <Section first>
        <Container size="wide">
          <ContentMediaSection
            {...hero}
            headingAs="h1"
            columnRatio="1:1"
            columnGap="112px"
            actionsOverride={
              hero.actions?.[0] && (
                <EnquiryTriggerButton variant={hero.actions[0].variant}>
                  {hero.actions[0].label}
                </EnquiryTriggerButton>
              )
            }
          />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <ContentMediaSection {...partnership} columnRatio="1:1" columnGap="112px" />
        </Container>
      </Section>

      <ExmCapabilitiesSection {...capabilities} />

      <WhyJoinSection
        {...brand}
        className="mx-2"
        buttonOverride={brand.button && <EnquiryTriggerButton>{brand.button.label}</EnquiryTriggerButton>}
      />

      <ProductionScaleSection
        {...dosage}
        showArrows={false}
        ctaOverride={dosage.cta && <EnquiryTriggerButton>{dosage.cta.label}</EnquiryTriggerButton>}
      />

      <Section>
        <Container size="wide">
          <FeatureGridSection {...international} align="left" mobileSlider />
        </Container>
      </Section>

      <ManufacturingProcessSection {...process} className="mx-2" />

      <ExmQualityChecklistSection {...quality} />

      <FaqSection {...faq} />

      <CtaSection eyebrow={cta.eyebrow} title={cta.title}>
        <EnquiryTriggerButton variant="secondary">{cta.button.label}</EnquiryTriggerButton>
      </CtaSection>
    </ManufacturingEnquiryProvider>
  );
}
