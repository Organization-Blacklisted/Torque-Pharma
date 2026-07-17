import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export const metadata: Metadata = {
  title: "Company",
  description: "Learn about Torque Pharma — our history, mission, and values.",
};

export default function CompanyPage() {
  return (
    <Section>
      <Container size="content">
        <h1 className="font-heading text-h1 font-light text-primary">Company</h1>
      </Container>
    </Section>
  );
}
