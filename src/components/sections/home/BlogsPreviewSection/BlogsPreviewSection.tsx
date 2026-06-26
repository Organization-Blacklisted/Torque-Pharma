import BlogCard from "@/components/ui/BlogCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import { BlogsPreviewSectionProps } from "./BlogsPreviewSection.types";

export default function BlogsPreviewSection({
  data: { title, sub_title, view_text, view_link, blogs },
  className = "",
}: BlogsPreviewSectionProps) {
  return (
    <div className={className}>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader eyebrow={title} title={sub_title} />
        <div className="shrink-0">
          <SplitButton variant="primary" href={`/${view_link}`}>
            {view_text}
          </SplitButton>
        </div>
      </div>

      <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.slug}
            slug={blog.slug}
            title={blog.title}
            featured_image={blog.image}
            category={blog.category_name ? { id: 0, name: blog.category_name, slug: "" } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
