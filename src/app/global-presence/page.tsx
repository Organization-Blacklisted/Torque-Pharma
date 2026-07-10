import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import FaqSection from "@/components/sections/shared/FaqSection";
import GpExportCredentialsSection from "@/components/sections/global-presence/GpExportCredentialsSection";
import GpCertificationsSection from "@/components/sections/global-presence/GpCertificationsSection";
import GpExportCategoriesSection from "@/components/sections/global-presence/GpExportCategoriesSection";
import GpTorqueModelSection from "@/components/sections/global-presence/GpTorqueModelSection";
import GpExportCapabilitySection from "@/components/sections/global-presence/GpExportCapabilitySection";
import GpFormSection from "@/components/sections/global-presence/GpFormSection";
import { getGlobalPresencePage } from "@/lib/api/global-presence";

export const metadata: Metadata = {
  title: "Global Presence | Torque Pharma",
  description: "Torque Pharma's worldwide manufacturing and distribution footprint.",
};

export default async function GlobalPresencePage() {
  const { certifications, exportCategories, credentials, exportCapability, torqueModel, form, faq } = await getGlobalPresencePage();

  return (
    <>
      <Section first>
        <Container size="reading">
          <GpCertificationsSection {...certifications} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <GpExportCategoriesSection {...exportCategories} />
        </Container>
      </Section>

      <Section>
        <GpExportCredentialsSection {...credentials} />
      </Section>

      <Section>
        <Container size="large">
          <GpExportCapabilitySection {...exportCapability} />
        </Container>
      </Section>

      <Section>
        <GpTorqueModelSection {...torqueModel} />
      </Section>

      <Section>
        <Container size="standard">
          <GpFormSection {...form} />
        </Container>
      </Section>

      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.title}
        description={faq.description}
        items={faq.items}
      />
    </>
  );
}
