import Image from "next/image";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { GpTopSectionProps } from "./GpTopSection.types";

function parseStatBlock(html: string) {
  const spanContent = html.match(/<span>(.*?)<\/span>/i)?.[1] ?? "";
  const label = html.match(/<strong>(.*?)<\/strong>/i)?.[1] ?? "";
  const number = label ? spanContent.replace(label, "").trim() : spanContent.trim();
  const trailing = html
    .replace(/<span>.*?<\/span>/gi, "")
    .replace(/<strong>.*?<\/strong>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return { number, label, trailing };
}

export default function GpTopSection({
  eyebrow,
  heading,
  subHeading,
  description,
  cta,
  className = "",
}: GpTopSectionProps) {
  const { number, label, trailing } = parseStatBlock(subHeading);

  return (
    <div className={`mt-[var(--spacing-page-top)] flex flex-col ${className}`}>
      <div className="mx-auto w-full max-w-[800px] px-3 md:px-4 lg:px-8">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          align="center"
          as="h1"
          size="h1"
          theme="light"
        />
      </div>

      <div className="relative mt-[clamp(1.875rem,3vw,3.125rem)] aspect-[1920/760] w-full overflow-hidden">
        <Image
          src="/images/map/map locations.png"
          alt="Torque Pharma global presence map"
          fill
          priority
          className="object-contain"
          sizes="100vw"
        />
      </div>

      <Container size="reading" className="mt-[var(--spacing-section-inner)]">
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Stat block */}
          <div className="flex flex-col justify-center gap-1 p-[var(--spacing-subsection)]">
            <p className="font-heading text-xl-h font-normal italic leading-none text-primary">
              {number}
            </p>
            <p className="font-heading text-h3 font-light text-primary">{label}</p>
            {trailing && (
              <p className="font-body text-body font-light capitalize tracking-[0.2px] text-primary">
                {trailing}
              </p>
            )}
          </div>

          {/* Gradient divider */}
          <div
            aria-hidden
            className="hidden md:block w-px shrink-0 self-stretch"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 20%, rgba(0,0,0,0.20) 80%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Description + CTA */}
          <div className="flex flex-1 flex-col items-start justify-center gap-6 p-[var(--spacing-subsection)]">
            <p className="font-body text-body leading-relaxed text-secondary">{description}</p>
            <SplitButton href={cta.href} variant="primary">{cta.label}</SplitButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
