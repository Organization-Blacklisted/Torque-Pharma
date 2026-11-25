import type { Metadata } from "next";
import { getThirdPartyManufacturingPage } from "@/lib/api/third-party-manufacturing";
import TpmHeroFormSection from "@/components/sections/third-party-manufacturing/TpmHeroFormSection";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import ExmCapabilitiesSection from "@/components/sections/export-manufacturing/ExmCapabilitiesSection";
import WhyJoinSection from "@/components/sections/career/WhyJoinSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import ProductionScaleSection from "@/components/sections/manufacturing/ProductionScaleSection";
import ManufacturingProcessSection from "@/components/sections/manufacturing/ManufacturingProcessSection";
import ExmQualityChecklistSection from "@/components/sections/export-manufacturing/ExmQualityChecklistSection";
import FaqSection from "@/components/sections/shared/FaqSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import ScrollToFormButton from "@/components/sections/third-party-manufacturing/TpmHeroFormSection/ScrollToFormButton";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

const PAGE_NAME = "Third-Party Manufacturing";
const PAGE_URL = "/third-party-manufacturing";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getThirdPartyManufacturingPage();
  return {
    title: seo.title ?? "Third-Party Manufacturing in India | Torque Pharma",
    description:
      seo.description ??
      "Explore third-party manufacturing at Torque Pharma, including Ayurveda, soap, pharmaceutical exports, and white label or private label solutions.",
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    robots: seo.index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function ThirdPartyManufacturingPage() {
  const { hero, form, partnership, capabilities, whiteLabel, values, production, process, quality, faq, cta } =
    await getThirdPartyManufacturingPage();

  return (
    <>
      <TpmHeroFormSection hero={hero} form={form} pageName={PAGE_NAME} pageUrl={PAGE_URL} />

      <Section spacing="none" className="mt-[60px] mb-[var(--spacing-section)] lg:mt-[120px]">
        <Container size="wide">
          <ContentMediaSection {...partnership} columnRatio="1:1" columnGap="112px" />
        </Container>
      </Section>

      <ExmCapabilitiesSection {...capabilities} />

      <WhyJoinSection
        {...whiteLabel}
        className="mx-2"
        buttonOverride={whiteLabel.button && <ScrollToFormButton>{whiteLabel.button.label}</ScrollToFormButton>}
      />

      <Section>
        <Container size="wide">
          <FeatureGridSection {...values} align="left" mobileSlider />
        </Container>
      </Section>

      <ProductionScaleSection {...production} showArrows={false} />

      <ManufacturingProcessSection {...process} className="mx-2" />

      <ExmQualityChecklistSection
        {...quality}
        buttonOverride={quality.button && <ScrollToFormButton>{quality.button.label}</ScrollToFormButton>}
      />

      <FaqSection {...faq} />

      <CtaSection eyebrow={cta.eyebrow} title={cta.title}>
        <ScrollToFormButton variant="secondary">{cta.button.label}</ScrollToFormButton>
      </CtaSection>
    </>
  );
}
