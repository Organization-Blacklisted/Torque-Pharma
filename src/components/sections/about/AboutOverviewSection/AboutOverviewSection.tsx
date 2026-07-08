import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import VideoBackground from "@/components/ui/VideoBackground";
import Marquee from "@/components/ui/Marquee";
import type { AboutOverviewSectionProps } from "./AboutOverviewSection.types";

export default function AboutOverviewSection({
  heading,
  description,
  video,
  videoPoster,
  marqueeItems,
  className = "",
}: AboutOverviewSectionProps) {
  return (
    <Section
      spacing="none"
      className={`pt-[var(--spacing-section-inner)] mb-[var(--spacing-section)] ${className}`}
    >
      <Container size="content">
        <SectionHeader
          title={heading}
          description={description}
          align="center"
          size="h2"
          headingClassName="max-w-[650px] mx-auto"
          descriptionClassName="max-w-[1098px] mx-auto"
        />
      </Container>
      <div className="relative mt-[var(--spacing-subsection)]">
        <Container size="reading">
          <div className="relative z-10 aspect-video overflow-hidden rounded-lg">
            {video ? (
              <VideoBackground
                sources={[{ src: video, type: "video/mp4" }]}
                poster={videoPoster}
                showAudioToggle
              />
            ) : (
              <Image
                src={videoPoster}
                alt={heading}
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        </Container>
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <Marquee items={marqueeItems} speed={30} className="w-full" />
        </div>
      </div>
    </Section>
  );
}
