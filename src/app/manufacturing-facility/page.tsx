import type { Metadata } from "next";
import Accordion from "@/components/ui/Accordion";
import CTA from "@/components/ui/CTA";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import ContentMediaSection from "@/components/sections/shared/ContentMediaSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import { manufacturingFacilityPage } from "@/data/manufacturing-facility.mock";
import ManufacturingStatsSection from "./sections/ManufacturingStatsSection";

export const metadata: Metadata = {
  title: "Manufacturing Facility | Torque Pharma",
  description:
    "World-class pharmaceutical manufacturing — 43.5 billion units annually across diverse dosage forms.",
};

export default function ManufacturingFacilityPage() {
  const { contentMedia, stats, cta, faq } = manufacturingFacilityPage;

  return (
    <>
      {/* Centered video section */}
      <Section first>
        <Container size="xl">
          <ContentMediaSection {...contentMedia} headingClassName="max-w-[900px] mx-auto text-pretty" />
        </Container>
      </Section>

      <ManufacturingStatsSection {...stats} />

      {/* CTA — wide container */}
      <Section as="div">
        <Container size="wide">
          <CTA eyebrow={cta.eyebrow} title={cta.title} variant="gradient">
            <SplitButton variant="secondary" href={cta.button.href}>
              {cta.button.label}
            </SplitButton>
          </CTA>
        </Container>
      </Section>

      {/* FAQ — reading container */}
      <Section>
        <Container size="reading">
          <SectionHeader
            eyebrow={faq.eyebrow}
            title={faq.heading}
            description={faq.description}
            align="center"
            className="mb-12"
          />
          <Accordion items={faq.items} />
        </Container>
      </Section>
    </>
  );
}
