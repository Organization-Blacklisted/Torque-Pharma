import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export const metadata: Metadata = {
  title: "Capabilities | Torque Pharma",
  description: "Torque Pharma's manufacturing capabilities and certifications.",
};

export default function CapabilitiesPage() {
  return (
    <Section>
      <Container size="content">
        <h1 className="font-heading text-h1 font-light text-primary">Capabilities</h1>
      </Container>
    </Section>
  );
}
