import type { Metadata } from "next";
import FaqSection from "@/components/sections/shared/FaqSection";
import GpExportCredentialsSection from "@/components/sections/global-presence/GpExportCredentialsSection";
import { getGlobalPresencePage } from "@/lib/api/global-presence";

export const metadata: Metadata = {
  title: "Global Presence | Torque Pharma",
  description: "Torque Pharma's worldwide manufacturing and distribution footprint.",
};

export default async function GlobalPresencePage() {
  const { credentials, faq } = await getGlobalPresencePage();

  return (
    <>
      <GpExportCredentialsSection {...credentials} />

      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.title}
        description={faq.description}
        items={faq.items}
      />
    </>
  );
}
