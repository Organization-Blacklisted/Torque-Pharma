import type { Metadata } from "next";
import { getAyurvedaSoapPage } from "@/lib/api/ayurveda-soap-manufacturing";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import ExmCapabilitiesSection from "@/components/sections/export-manufacturing/ExmCapabilitiesSection";
import WhyJoinSection from "@/components/sections/career/WhyJoinSection";
import ProductionSection from "@/components/sections/manufacturing/ProductionSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import ExmQualityChecklistSection from "@/components/sections/export-manufacturing/ExmQualityChecklistSection";
import FaqSection from "@/components/sections/shared/FaqSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAyurvedaSoapPage();
  return {
    title: seo.title ?? "Third-Party Ayurveda & Soap Manufacturing | Torque Pharma",
    description:
      seo.description ??
      "Explore third-party Ayurvedic product and soap manufacturing in India with Torque Pharma. Discover existing formulations, private label options, and manufacturing support.",
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    robots: seo.index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function AyurvedaSoapManufacturingPage() {
  const { hero, domestic, capabilities, formulations, brand, facilities, why, quality, faq, cta } =
    await getAyurvedaSoapPage();

  return (
    <>
      <Section first>
        <Container size="wide">
          <ContentMediaSection {...hero} headingAs="h1" columnRatio="1:1" columnGap="112px" />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <ContentMediaSection {...domestic} columnRatio="1:1" columnGap="112px" />
        </Container>
      </Section>

      <ExmCapabilitiesSection {...capabilities} />

      <WhyJoinSection {...brand} className="mx-2" />

      <Section>
        <Container size="wide">
          <ContentMediaSection {...formulations} columnRatio="1:1" columnGap="112px" />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <ProductionSection
            eyebrow={facilities.eyebrow}
            title={facilities.title}
            description={facilities.description}
            items={facilities.items}
            imagePosition="left"
          />
          {facilities.button && (
            <div className="mt-[var(--spacing-subsection)] flex justify-center">
              <SplitButton href={facilities.button.href} variant="primary">
                {facilities.button.label}
              </SplitButton>
            </div>
          )}
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <FeatureGridSection {...why} align="left" mobileSlider />
        </Container>
      </Section>

      <ExmQualityChecklistSection {...quality} />

      <FaqSection {...faq} />

      <CtaSection
        eyebrow={cta.eyebrow}
        title={cta.title}
        button={{ label: cta.button.label, href: cta.button.href }}
      />
    </>
  );
}
