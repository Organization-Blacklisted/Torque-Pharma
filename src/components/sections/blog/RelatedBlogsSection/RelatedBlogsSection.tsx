import BlogCard from "@/components/ui/BlogCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { RelatedBlogsSectionProps } from "./RelatedBlogsSection.types";

export default function RelatedBlogsSection({ posts, className = "" }: RelatedBlogsSectionProps) {
  if (!posts.length) return null;

  return (
    <div className={className}>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader eyebrow="Continue Reading" title="The Latest From Torque's Knowledge Shelf" />
        <div className="shrink-0">
          <SplitButton variant="primary" href="/blogs">
            See All Blogs
          </SplitButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            featured_image={post.featured_image}
            category={post.category}
          />
        ))}
      </div>
    </div>
  );
}
