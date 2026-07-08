import type { Metadata } from "next";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import { getBoardPage } from "@/lib/api/board";
import FounderSection from "@/components/sections/board/FounderSection";
import DirectorSection from "@/components/sections/board/DirectorSection";
import ExecutiveDirectorateSection from "@/components/sections/board/ExecutiveDirectorateSection";
import CtaSection from "@/components/sections/shared/CtaSection";

export const metadata: Metadata = {
  title: "Board of Directors | Torque Pharma",
  description:
    "Meet the visionary leaders of Torque Pharma — a board of experienced professionals driving people-first healthcare progress since 1985.",
};

export default async function BoardOfDirectorsPage() {
  const { contentMedia, founder, director, executiveDirectorate, cta } = await getBoardPage();

  return (
    <>
      {/* Executive board — centered image + content */}
      <Section first>
        <Container size="xl">
          <ContentMediaSection
            {...contentMedia}
            headingClassName="max-w-[900px] mx-auto text-pretty"
          />
        </Container>
      </Section>

      {/* Founder */}
      <Section>
        <Container size="wide">
          <FounderSection {...founder} />
        </Container>
      </Section>

      {/* Managing Director */}
      <Section>
        <DirectorSection {...director} className="mx-2" />
      </Section>

      {/* Executive Directorate */}
      <Section>
        <Container size="large">
          <ExecutiveDirectorateSection {...executiveDirectorate} />
        </Container>
      </Section>

      {/* CTA */}
      <CtaSection
        eyebrow={cta.eyebrow}
        title={cta.title}
        button={{ label: cta.button.label, href: cta.button.href }}
      />
    </>
  );
}
