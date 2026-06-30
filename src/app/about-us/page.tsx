import type { Metadata } from "next";
import CTA from "@/components/ui/CTA";
import StatCard from "@/components/ui/StatCard";
import Marquee from "@/components/ui/Marquee";
import VideoBackground from "@/components/ui/VideoBackground";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import { aboutUsPage } from "@/data/about-us.mock";
import { getAboutUsPage } from "@/lib/api/about";

const MARQUEE_ITEMS = ["Better Together", "Better Health", "Better Life", "Better People", "Better Planet"];

export const metadata: Metadata = {
  title: "About Us | Torque Pharma",
  description:
    "Learn about Torque Pharma — our history, mission, values, and commitment to better health since 1985.",
};

export default async function AboutUsPage() {
  const { overview, cta } = aboutUsPage;
  const { contentMedia, stats } = await getAboutUsPage();

  return (
    <>
      {/* Who We Are — split image + content */}
      <Section first spacing="none" className="mt-[var(--spacing-page-top)] pb-[var(--spacing-section-inner)]">
        <Container>
          <ContentMediaSection {...contentMedia} />
        </Container>
      </Section>

      <Container>
        <hr className="border-t border-primary" />
      </Container>

      {/* Overview — heading, then full-width marquee with video floating on top */}
      <Section spacing="none" className="pt-[var(--spacing-section-inner)] mb-[var(--spacing-section)]">
        <Container size="content">
          <SectionHeader
            title={overview.heading}
            description={overview.description}
            align="center"
            size="h2"
          />
        </Container>
        <div className="relative mt-[var(--spacing-subsection)]">
          {/* Video — sets the height, sits above the marquee */}
          <Container size="standard">
            <div className="relative z-10 aspect-video overflow-hidden">
              <VideoBackground
                sources={[{ src: overview.video, type: "video/mp4" }]}
                showAudioToggle
              />
            </div>
          </Container>
          {/* Marquee — full section width, vertically centred behind the video */}
          <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
            <Marquee items={MARQUEE_ITEMS} speed={30} />
          </div>
        </div>
      </Section>

      {/* Stats grid */}
      <Section>
        <Container>
          <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section as="div">
        <Container size="wide">
          <CTA
            eyebrow={cta.eyebrow}
            title={cta.title}
            description={cta.description}
            variant="glass"
          >
            <SplitButton variant="primary" href={cta.button.href}>
              {cta.button.label}
            </SplitButton>
          </CTA>
        </Container>
      </Section>
    </>
  );
}
