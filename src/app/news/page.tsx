import type { Metadata } from "next";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import { getNews } from "@/lib/api/news";
import NewsHeroSection from "@/components/sections/news/NewsHeroSection";
import NewsAwardsSection from "@/components/sections/news/NewsAwardsSection";
import NewsArchiveSection from "@/components/sections/news/NewsArchiveSection";

export const metadata: Metadata = {
  title: "News & Media",
  description:
    "Follow Torque Pharma's latest announcements, media features, industry mentions, and updates from Torque Pharma's expanding global presence.",
};

export default async function NewsPage() {
  const items = await getNews();

  const featured = items.find((item) => item.is_featured) ?? null;
  const editorsPicks = items.filter((item) => item.is_editors_pick);
  const archiveItems = items.filter((item) => !item.is_featured && !item.is_editors_pick);

  return (
    <>
      <Section first>
        <Container size="wide">
          <NewsHeroSection featured={featured} editorsPicks={editorsPicks} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <NewsArchiveSection items={archiveItems} />
        </Container>
      </Section>

      <Section>
        <Container size="content">
          <NewsAwardsSection />
        </Container>
      </Section>
    </>
  );
}
