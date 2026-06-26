import type { Metadata } from "next";
import { getHomePage } from "@/lib/api/home";
import HeroVideo from "@/components/sections/home/HeroVideo";
import HomeStatsMediaSection from "@/components/sections/home/HomeStatsMediaSection";
import HomeImpactSection from "@/components/sections/home/HomeImpactSection";
import HomeGlobalPresenceSection from "@/components/sections/home/HomeGlobalPresenceSection";
import LifeAtTorqueSection from "@/components/sections/home/LifeAtTorqueSection";
import BlogsPreviewSection from "@/components/sections/home/BlogsPreviewSection";
import ContractManufacturingSection from "@/components/sections/home/ContractManufacturingSection";
import TherapeuticAreasSection from "@/components/sections/home/TherapeuticAreasSection";
import HomeOverviewSection from "@/components/sections/home/HomeOverviewSection";
import TorqueLineupSection from "@/components/sections/home/TorqueLineupSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import { homepageMock } from "@/data/homepage.mock";

export const metadata: Metadata = {
  title: "Torque Pharma | People's Pharmaceutical Company",
  description:
    "Torque Pharma combines precise science with human care to deliver world-class pharmaceutical manufacturing and trusted healthcare solutions across 25+ countries.",
};

export default async function Home() {
  const { statsMedia, therapeuticAreas, torqueLineup } = homepageMock;
  const { hero, overview, impact, globalPresence, lifeAtTorque, contractManufacturing, blogsPreview } = await getHomePage();

  return (
    <main>
      <HeroVideo data={hero} />
      <Section first>
        <Container size="large">
          <HomeOverviewSection data={overview} />
        </Container>
      </Section>
      <Section>
        <TherapeuticAreasSection data={therapeuticAreas} />
      </Section>
      <Section>
        <Container size="content">
          <HomeGlobalPresenceSection data={globalPresence} />
        </Container>
      </Section>
      <Section>
        <Container size="wide">
          <TorqueLineupSection data={torqueLineup} />
        </Container>
      </Section>
      <HomeStatsMediaSection data={statsMedia} />
      <Section>
        <Container size="standard">
          <HomeImpactSection data={impact} />
        </Container>
      </Section>
      <Section>
        <Container size="wide">
          <LifeAtTorqueSection data={lifeAtTorque} />
        </Container>
      </Section>
      <Section>
        <ContractManufacturingSection data={contractManufacturing} className="mx-2" />
      </Section>
      <Section>
        <Container>
          <BlogsPreviewSection data={blogsPreview} />
        </Container>
      </Section>
   
    </main>
  );
}
