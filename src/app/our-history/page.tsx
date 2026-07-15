import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import HistTopSection from "@/components/sections/history/HistTopSection";
import HistJourneySection from "@/components/sections/history/HistJourneySection";
import { getHistoryPage } from "@/lib/api/history";

export const metadata: Metadata = {
  title: "Our History | Torque Pharma",
  description: "Four decades of formulations, GMP-certified facilities, and milestones that shaped Torque Pharma's journey in healthcare.",
};

export default async function HistoryPage() {
  const { top, journeyLabel, journey } = await getHistoryPage();

  return (
    <>
      <Section first>
        <Container size="large">
          <HistTopSection {...top} journeyLabel={journeyLabel} />
        </Container>
      </Section>

      <HistJourneySection section={journey} />
    </>
  );
}
