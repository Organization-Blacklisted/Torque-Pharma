import type { Metadata } from "next";
import { getCodeOfConductPage } from "@/lib/api/code-of-conduct";
import CodeOfConductSection from "@/components/sections/code-of-conduct/CodeOfConductSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCodeOfConductPage();
  return {
    title: `${data.title} | Torque Pharma`,
    description: data.subtitle,
  };
}

export default async function CodeOfConductPage() {
  const data = await getCodeOfConductPage();

  return (
    <main>
      <Section first>
        <Container size="wide">
          <CodeOfConductSection data={data} />
        </Container>
      </Section>
    </main>
  );
}
