import Container from "@/components/layouts/Container";
import { SplitButton } from "@/components/ui/SplitButton";
import TypewriterWord from "@/components/ui/TypewriterWord";
import VideoBackground from "@/components/ui/VideoBackground";
import type { HeroVideoProps } from "./HeroVideo.types";

export default function HeroVideo({ data }: HeroVideoProps) {
  const { eyebrow, heading, cta, video } = data;

  return (
    <section className="relative h-[85svh] min-h-[600px] overflow-hidden -mt-[92px] lg:-mt-[96px] lg:h-svh">

      {/* Video layer */}
      <VideoBackground sources={video.sources} poster={video.poster} />

      {/* Gradient overlay — dark at bottom, fades out upward */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"
        aria-hidden="true"
      />

      {/* Content */}
      <Container size="wide" className="relative h-full">
        <div className="flex h-full flex-col items-center justify-end pb-12 text-center nav:items-start nav:pb-20 nav:text-left">

          {/* Eyebrow pill */}
          {eyebrow.prefix && (
            <div className="hero-eyebrow-gradient mb-5 inline-flex items-center gap-1.5 rounded-[32px] border border-white/40 px-7 pt-[9.76px] pb-[9.24px]">
              <span className="font-body text-body-lg uppercase  text-white leading-tight">
                {eyebrow.prefix}
              </span>
              {eyebrow.words.length > 0 && (
                <TypewriterWord
                  words={eyebrow.words}
                  className="font-body text-body-lg uppercase  text-white leading-tight"
                />
              )}
            </div>
          )}

          {/* Heading */}
          <h1 className="font-heading text-h1 font-light leading-[1.1] text-white max-w-[20ch]">
            {heading}
          </h1>

          {/* CTA */}
          <div className="mt-8">
            <SplitButton variant="primary" href={cta.href}>
              {cta.label}
            </SplitButton>
          </div>

        </div>
      </Container>

    </section>
  );
}
