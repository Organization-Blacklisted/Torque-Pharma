import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import HistTopSection from "@/components/sections/history/HistTopSection";
import { getHistoryPage } from "@/lib/api/history";

export const metadata: Metadata = {
  title: "Our History | Torque Pharma",
  description: "Four decades of formulations, GMP-certified facilities, and milestones that shaped Torque Pharma's journey in healthcare.",
};

export default async function HistoryPage() {
  const { top, journeyLabel } = await getHistoryPage();

  return (
    <>
      <Section first>
        <Container size="reading">
          <HistTopSection {...top} journeyLabel={journeyLabel} />
        </Container>
      </Section>
    </>
  );
}
