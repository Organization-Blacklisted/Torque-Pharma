import MediaContentCard from "@/components/ui/MediaContentCard";
import { SplitButton } from "@/components/ui/SplitButton";
import StatRotator from "@/components/ui/StatRotator";
import VideoBackground from "@/components/ui/VideoBackground";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import StatsMediaSection from "@/components/sections/shared/StatsMediaSection";

import { HomeStatsMediaSectionProps } from "./HomeStatsMediaSection.types";

export default function HomeStatsMediaSection({ data }: HomeStatsMediaSectionProps) {
  const { eyebrow, title, description, stats, media, card, footer } = data;

  return (
    <Section>
      <Container>
        <StatsMediaSection
          eyebrow={eyebrow}
          title={title}
          description={description}
          footer={
            footer && (
              <div className="flex justify-center">
                <SplitButton variant="primary" href={footer.href}>
                  {footer.label}
                </SplitButton>
              </div>
            )
          }
        >
          <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-2 xl:grid-cols-4">
            {/* Rotating stat cards — spans 2 cols */}
            <div className="min-w-0 md:col-span-2">
              <StatRotator slots={stats} />
            </div>

            {/* Video + content card joined as one unit — spans 2 cols */}
            <div className="flex flex-col overflow-hidden rounded-lg md:col-span-2 md:flex-row">
              <div className="relative min-h-[260px] flex-1">
                <VideoBackground sources={media.sources} poster={media.poster} />
              </div>
              <div className="flex-1">
                <MediaContentCard
                  title={card.title}
                  description={card.description}
                  className="h-full rounded-none"
                >
                  {card.cta && (
                    <SplitButton variant="ghost" href={card.cta.href}>
                      {card.cta.label}
                    </SplitButton>
                  )}
                </MediaContentCard>
              </div>
            </div>
          </div>
        </StatsMediaSection>
      </Container>
    </Section>
  );
}
