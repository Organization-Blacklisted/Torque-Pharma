import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAwardsPage } from "@/lib/api/awards";
import AwardsSection from "@/components/sections/awards/AwardsSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAwardsPage();
  return {
    title: `${page.title} | Torque Pharma`,
    description: page.description,
  };
}

export default async function CertificationsPage() {
  const page = await getAwardsPage();

  if (!page) notFound();

  return (
    <main>
      <Section first>
        <Container size="content">
          <AwardsSection data={page} />
        </Container>
      </Section>
    </main>
  );
}
