import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import { getCareerPage } from "@/lib/api/career";

export const metadata: Metadata = {
  title: "Careers | Torque Pharma",
  description: "Join Torque Pharma and be part of a team dedicated to making quality healthcare more accessible across the world.",
};

export default async function CareerPage() {
  const { faq } = await getCareerPage();

  return (
    <>
      <Section first>
        <Container size="reading">
          <SectionHeader
            eyebrow={faq.heading}
            title={faq.subTitle}
            align="center"
            className="mb-12"
          />
          <Accordion items={faq.items} />
        </Container>
      </Section>
    </>
  );
}
