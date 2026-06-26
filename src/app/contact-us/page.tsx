import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export const metadata: Metadata = {
  title: "Contact Us | Torque Pharma",
  description: "Get in touch with Torque Pharma — reach our teams across sales, partnerships, and manufacturing enquiries.",
};

export default function ContactUsPage() {
  return (
    <Section>
      <Container size="content">
        <h1 className="font-heading text-h1 font-light text-primary">Contact Us</h1>
      </Container>
    </Section>
  );
}
