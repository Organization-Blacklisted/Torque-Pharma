import type { Metadata } from "next";
import Image from "next/image";
import CTA from "@/components/ui/CTA";
import StatCard from "@/components/ui/StatCard";
import Marquee from "@/components/ui/Marquee";
import VideoBackground from "@/components/ui/VideoBackground";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import MissionVisionSection from "@/components/sections/about/MissionVisionSection";
import ValuesSection from "@/components/sections/about/ValuesSection";
import BuiltOnSection from "@/components/sections/about/BuiltOnSection";
import ConnectSection from "@/components/sections/about/ConnectSection";
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
            headingClassName="max-w-[650px] mx-auto"
            descriptionClassName="max-w-[1098px] mx-auto"
          />
        </Container>
        <div className="relative mt-[var(--spacing-subsection)]">
          {/* Video — sets the height, sits above the marquee */}
          <Container size="reading">
            <div className="relative z-10 aspect-video overflow-hidden rounded-lg">
              {overview.video ? (
                <VideoBackground
                  sources={[{ src: overview.video, type: "video/mp4" }]}
                  poster={overview.videoPoster}
                  showAudioToggle
                />
              ) : (
                <Image
                  src={overview.videoPoster}
                  alt={overview.heading}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          </Container>
          {/* Marquee — full section width, vertically centred behind the video */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <Marquee items={overview.marqueeItems} speed={30} className="w-full" />
          </div>
        </div>
      </Section>

      {/* Stats grid */}
      <Section>
        <Container>
          <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} animated />
            ))}
          </div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <Container size="narrow">
          <MissionVisionSection items={missionVision.items} />
        </Container>
      </Section>

      {/* Our Values */}
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

      {/* What Torque Is Built On */}
      <Section>
        <Container size="narrow">
          <BuiltOnSection
            eyebrow={builtOn.eyebrow}
            subTitle={builtOn.subTitle}
            items={builtOn.items}
          />
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

      {/* Connect With Us */}
      <Section>
        <Container size="large">
          <ConnectSection
            eyebrow={connect.eyebrow}
            subTitle={connect.subTitle}
            image={connect.image}
          />
        </Container>
      </Section>
    </>
  );
}
