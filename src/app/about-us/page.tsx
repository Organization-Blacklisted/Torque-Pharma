import type { Metadata } from "next";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import MissionVisionSection from "@/components/sections/about/MissionVisionSection";
import ValuesSection from "@/components/sections/about/ValuesSection";
import BuiltOnSection from "@/components/sections/about/BuiltOnSection";
import ConnectSection from "@/components/sections/shared/ConnectSection";
import AboutOverviewSection from "@/components/sections/about/AboutOverviewSection";
import AboutStatsSection from "@/components/sections/about/AboutStatsSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import { getAboutUsPage } from "@/lib/api/about";

export const metadata: Metadata = {
  title: "About Us | Torque Pharma",
  description:
    "Learn about Torque Pharma — our history, mission, values, and commitment to better health since 1985.",
};

export default async function AboutUsPage() {
  const { contentMedia, overview, missionVision, values, builtOn, connect, stats, cta } = await getAboutUsPage();

  return (
    <>
      <Section first spacing="none" className="mt-[var(--spacing-page-top)] pb-[var(--spacing-section-inner)]">
        <Container>
          <ContentMediaSection {...contentMedia} headingAs="h1" />
        </Container>
      </Section>

      <Container>
        <hr className="border-t border-primary" />
      </Container>

      <AboutOverviewSection {...overview} />

      <AboutStatsSection items={stats} />

      <Section>
        <Container size="narrow">
          <MissionVisionSection items={missionVision.items} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <ValuesSection
            eyebrow={values.eyebrow}
            subTitle={values.subTitle}
            items={values.items}
            cta={values.cta}
          />
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <BuiltOnSection
            eyebrow={builtOn.eyebrow}
            subTitle={builtOn.subTitle}
            items={builtOn.items}
          />
        </Container>
      </Section>

      <CtaSection
        eyebrow={cta.eyebrow}
        title={cta.title}
        description={cta.description}
        variant="glass"
        button={{ label: cta.button.label, href: cta.button.href, variant: "primary" }}
      />

      <Section>
        <Container size="large">
          <ConnectSection
            variant="about"
            eyebrow={connect.eyebrow}
            title={connect.subTitle}
            image={connect.image}
          />
        </Container>
      </Section>
    </>
  );
}
