import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import ThirdPartyManufacturingForm from "./ThirdPartyManufacturingForm";
import type { TpmHeroFormSectionProps } from "./TpmHeroFormSection.types";

export default function TpmHeroFormSection({ hero, form, pageName, pageUrl }: TpmHeroFormSectionProps) {
  return (
    <Section
      spacing="none"
      className="relative -mt-[92px] flex min-h-screen items-center overflow-hidden lg:-mt-[96px]"
    >
      {hero.image && (
        <div className="absolute inset-0 -z-10">
          <Image src={hero.image} alt="" fill className="object-cover" priority />
        </div>
      )}

      <Container
        size="wide"
        className="pt-[calc(92px+var(--spacing-page-top))] pb-[var(--spacing-section-inner)] lg:pt-[96px] lg:pb-0"
      >
        <div className="grid min-w-0 items-start gap-[clamp(24px,_8vw,_160px)] lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">
            <SectionHeader eyebrow={hero.eyebrow} title={hero.title} as="h1" size="h1" />
            <p className="mt-5 text-body leading-6 text-secondary">{hero.description}</p>
            <div className="mt-8">
              <SplitButton href={hero.button.href} variant="primary">
                {hero.button.label}
              </SplitButton>
            </div>
          </div>

          <div className="min-w-0 rounded-lg bg-dark-blue p-5 sm:p-8 lg:p-10">
            <ThirdPartyManufacturingForm
              title={form.title}
              subtitle={form.subtitle}
              pageName={pageName}
              pageUrl={pageUrl}
              submitLabel={form.submitLabel}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
