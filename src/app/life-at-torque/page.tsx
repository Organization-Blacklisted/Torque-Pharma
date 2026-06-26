import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export const metadata: Metadata = {
  title: "Life at Torque | Torque Pharma",
  description: "Culture, careers, and life inside Torque Pharma.",
};

export default function LifeAtTorquePage() {
  return (
    <Section>
      <Container size="content">
        <h1 className="font-heading text-h1 font-light text-primary">Life at Torque</h1>
      </Container>
    </Section>
  );
}
