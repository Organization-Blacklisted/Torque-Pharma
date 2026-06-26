import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";

export const metadata: Metadata = {
  title: "Products | Torque Pharma",
  description: "Explore Torque Pharma's pharmaceutical product portfolio.",
};

export default function ProductsPage() {
  return (
    <Section>
      <Container size="content">
        <h1 className="font-heading text-h1 font-light text-primary">Products</h1>
      </Container>
    </Section>
  );
}
