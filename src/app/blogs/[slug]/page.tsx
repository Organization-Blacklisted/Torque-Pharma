import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/api/blog-post";
import { getBlogs, getRelatedBlogs } from "@/lib/api/blogs";
import BlogPostHero from "@/components/sections/blog/BlogPostHero";
import BlogPostBody from "@/components/sections/blog/BlogPostBody";
import RelatedBlogsSection from "@/components/sections/blog/RelatedBlogsSection";
import JsonLd from "@/components/ui/JsonLd";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return { title: "Blog" };
  return {
    title: post.seo.title,
    description: post.seo.description,
    robots: { index: post.seo.index, follow: true },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, relatedPosts] = await Promise.all([
    getBlogPost(slug).catch(() => null),
    getRelatedBlogs(slug, 3).catch(() => []),
  ]);

  if (!post || post.status !== "published") notFound();

  return (
    <>
      <JsonLd data={post.seo.schema} />
      <Section spacing="none" className="bg-dark-blue -mt-[92px] lg:-mt-[96px] pt-[calc(92px+var(--spacing-page-top))] lg:pt-[calc(96px+var(--spacing-page-top))] pb-[var(--spacing-section-inner)]">
        <Container size="wide">
          <BlogPostHero post={post} />
        </Container>
      </Section>

      <Section spacing="none" className="mt-[var(--spacing-section-inner)] mb-[var(--spacing-section)]">
        <Container size="wide">
          <BlogPostBody post={post} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <RelatedBlogsSection posts={relatedPosts} />
        </Container>
      </Section>
    </>
  );
}
