import type { Metadata } from "next";
import { getDealerPage } from "@/lib/api/dealer";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import FeatureGridSection from "@/components/sections/shared/FeatureGridSection";
import DealerNetworkSection from "@/components/sections/dealer/DealerNetworkSection";
import DealerEligibilitySection from "@/components/sections/dealer/DealerEligibilitySection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqSection from "@/components/sections/shared/FaqSection";

export const metadata: Metadata = {
  title: "Become a Dealer | Torque Pharma",
  description:
    "Partner with Torque Pharma to access a diverse product portfolio, dependable supply, and the support needed to grow confidently in your market.",
};

export default async function BecomeADealerPage() {
  const { banner, benefits, eligibility, network, cta, faq } = await getDealerPage();

  return (
    <>
      <Section first>
        <Container size="xl">
          <ContentMediaSection
            {...banner}
            headingAs="h1"
            headerClassName="max-w-[1200px] mx-auto"
          />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <FeatureGridSection {...benefits} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <DealerEligibilitySection {...eligibility} />
        </Container>
      </Section>

      <Section padded className="bg-dark-blue">
        <Container size="xl">
          <DealerNetworkSection {...network} />
        </Container>
      </Section>

      <CtaSection
        eyebrow={cta.eyebrow}
        title={cta.title}
        button={{ label: cta.button.label, href: cta.button.href }}
      />

      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.heading}
        description={faq.description}
        items={faq.items}
      />
    </>
  );
}
