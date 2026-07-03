import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/api/blog-post";
import { getBlogs } from "@/lib/api/blogs";
import BlogPostHero from "@/components/sections/blog/BlogPostHero";
import BlogPostBody from "@/components/sections/blog/BlogPostBody";
import RelatedBlogsSection from "@/components/sections/blog/RelatedBlogsSection";
import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
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
  const [post, allPosts] = await Promise.all([getBlogPost(slug), getBlogs()]);

  if (!post || post.status !== "published") notFound();

  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
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
