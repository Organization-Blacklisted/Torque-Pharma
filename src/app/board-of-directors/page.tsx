import type { Metadata } from "next";
import CTA from "@/components/ui/CTA";
import { SplitButton } from "@/components/ui/SplitButton";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import { boardOfDirectorsPage } from "@/data/board-of-directors.mock";

export const metadata: Metadata = {
  title: "Board of Directors | Torque Pharma",
  description:
    "Meet the visionary leaders of Torque Pharma — a board of experienced professionals driving people-first healthcare progress since 1985.",
};

export default function BoardOfDirectorsPage() {
  const { contentMedia, cta } = boardOfDirectorsPage;

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

      {/* CTA */}
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
