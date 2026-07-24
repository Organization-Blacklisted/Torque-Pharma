import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNews, getNewsDetail } from "@/lib/api/news";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import NewsDetailHero from "@/components/sections/news/NewsDetailHero";
import NewsDetailBody from "@/components/sections/news/NewsDetailBody";
import RelatedNewsSection from "@/components/sections/news/RelatedNewsSection";

export async function generateStaticParams() {
  const items = await getNews();
  return items.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsDetail(slug).catch(() => null);
  if (!news) return { title: "News" };
  return {
    title: news.title,
    description: news.short_description ?? news.title,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [news, allNews] = await Promise.all([
    getNewsDetail(slug).catch(() => null),
    getNews().catch(() => []),
  ]);

  if (!news || news.status !== "published") notFound();

  const relatedNews = allNews
    .filter((item) => item.slug !== slug)
    .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime())
    .slice(0, 3);

  return (
    <>
      <Section first>
        <Container size="wide">
          <NewsDetailHero news={news} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <NewsDetailBody news={news} />
        </Container>
      </Section>

      {relatedNews.length > 0 && (
        <Section>
          <Container size="wide">
            <RelatedNewsSection items={relatedNews} />
          </Container>
        </Section>
      )}
    </>
  );
}
