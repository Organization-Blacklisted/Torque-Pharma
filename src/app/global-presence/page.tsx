import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export const metadata: Metadata = {
  title: "Global Presence | Torque Pharma",
  description: "Torque Pharma's worldwide manufacturing and distribution footprint.",
};

export default function GlobalPresencePage() {
  return (
    <Section>
      <Container size="content">
        <h1 className="font-heading text-h1 font-light text-primary">Global Presence</h1>
      </Container>
    </Section>
  );
}
