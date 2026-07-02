import type { Metadata } from "next";
import { getEvents } from "@/lib/api/events";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import EventsSection from "@/components/sections/events/EventsSection";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore Torque Pharma's event highlights — from healthcare summits and marathons to global exhibitions and brand milestones.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Section first>
        <Container>
          <EventsSection events={events} />
        </Container>
      </Section>
    </>
  );
}
