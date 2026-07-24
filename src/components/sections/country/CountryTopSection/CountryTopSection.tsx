import Image from "next/image";
import SafeHtml from "@/components/ui/SafeHtml";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import type { CountryTopSectionProps } from "./CountryTopSection.types";

export default function CountryTopSection({
  top,
  counter,
  className = "",
}: CountryTopSectionProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Soft white ambient blob — matches Figma feGaussianBlur decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[60%_40%_50%_70%/50%_60%_40%_50%] bg-white opacity-60"
        style={{ filter: "blur(80px)" }}
      />

      <Container size="wide" className="relative z-10">
        <div className="flex flex-col items-center gap-[var(--spacing-subsection)] text-center">
          {/* Eyebrow + h1 */}
          <SectionHeader
            eyebrow={top.eyebrow}
            title={top.title}
            as="h1"
            size="h1"
            align="center"
          />

          {/* Featured map SVG with watermark behind it */}
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
              <Image
                src={top.bgImage}
                alt=""
                fill
                priority
                className="object-contain object-center"
                sizes="100vw"
              />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[220px] py-4 sm:max-w-[380px] sm:py-8">
              <Image
                src={top.featuredImage}
                alt={top.title}
                width={380}
                height={340}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6">
            {counter.items.map((item) => (
              <div key={item.description} className="flex flex-col items-center gap-1">
                <SafeHtml
                  html={item.title}
                  className="font-heading text-stat leading-none text-mint [&_span]:text-h3"
                />
                <span className="font-body text-body-sm text-secondary">
                  {item.description}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <SafeHtml
            html={counter.description}
            className="rich-text mx-auto max-w-[1065px] text-center text-secondary [&>p+p]:mt-4 [&_strong]:!text-secondary"
          />

          {/* CTA — links to the country's PDF company profile; opens in a new tab once Laravel sets a real URL */}
          <SplitButton href={counter.cta.href} external={counter.cta.href !== "#"} variant="primary">
            {counter.cta.label}
          </SplitButton>
        </div>
      </Container>
    </div>

  );
}
