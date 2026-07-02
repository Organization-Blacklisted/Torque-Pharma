"use client";

import { useMemo, useRef, useState } from "react";
import BlogCard from "@/components/ui/BlogCard";
import FeaturedBlogSlider from "@/components/ui/FeaturedBlogSlider";
import Pagination from "@/components/ui/Pagination";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import type { BlogsSectionProps } from "./BlogsSection.types";

const PER_PAGE = 6;
const ALL_BLOGS = "All Blogs";

const tabId = (cat: string) =>
  `tab-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;

export default function BlogsSection({ data: { posts }, className = "" }: BlogsSectionProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_BLOGS);
  const [currentPage, setCurrentPage] = useState(1);
  const tabsRef = useRef<HTMLDivElement>(null);

  const featuredPosts = useMemo(() => posts.filter((p) => p.is_featured), [posts]);
  const regularPosts = useMemo(() => posts.filter((p) => !p.is_featured), [posts]);

  const categories = useMemo(() => {
    const byId = new Map<number, string>();
    regularPosts.forEach((p) => byId.set(p.category.id, p.category.name));
    return [ALL_BLOGS, ...[...byId.entries()].sort((a, b) => a[0] - b[0]).map(([, name]) => name)];
  }, [regularPosts]);

  const filteredPosts = useMemo(
    () =>
      activeCategory === ALL_BLOGS
        ? regularPosts
        : regularPosts.filter((p) => p.category.name === activeCategory),
    [regularPosts, activeCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PER_PAGE));
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (tabsRef.current) {
      const top = tabsRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className={className}>
      <SectionHeader
        eyebrow="The Torque Journal"
        title="Thoughtful Reads on Health, Science, and Human Wellbeing"
        align="center"
        as="h1"
        size="h1"
        className="mx-auto mb-10 max-w-[1080px]"
      />

      <FeaturedBlogSlider posts={featuredPosts} className="mb-[var(--spacing-section)]" />

      <SectionHeader
        title="Find Your Next Useful Read"
        align="center"
        as="h2"
        size="h2"
        className="mx-auto mb-10"
      />

      <div ref={tabsRef}>
        <TabList className="mb-10 justify-start gap-[clamp(2rem,_3vw,_2.5rem)] lg:justify-center">
          {categories.map((category) => (
            <Tab
              key={category}
              id={tabId(category)}
              isActive={activeCategory === category}
              panelId="blogs-tab-panel"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Tab>
          ))}
        </TabList>
      </div>

      <div
        id="blogs-tab-panel"
        role="tabpanel"
        aria-labelledby={tabId(activeCategory)}
        className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {paginatedPosts.map((post) => (
          <BlogCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            featured_image={post.featured_image}
            category={post.category}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mx-auto mt-12"
      />
    </div>
  );
}
