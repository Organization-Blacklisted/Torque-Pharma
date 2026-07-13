"use client";

import { useMemo, useRef, useState } from "react";
import NewsCard from "@/components/ui/NewsCard";
import Pagination from "@/components/ui/Pagination";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import type { NewsArchiveSectionProps } from "./NewsArchiveSection.types";

const PER_PAGE = 6;
const ALL = "All";

export default function NewsArchiveSection({ items, className = "" }: NewsArchiveSectionProps) {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const byId = new Map<number, string>();
    items.forEach((item) => {
      if (item.category) byId.set(item.category.id, item.category.name);
    });
    return [ALL, ...[...byId.entries()].sort((a, b) => a[0] - b[0]).map(([, name]) => name)];
  }, [items]);

  const filtered = useMemo(
    () =>
      activeCategory === ALL
        ? items
        : items.filter((item) => item.category?.name === activeCategory),
    [items, activeCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [filtered, currentPage]
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridRef.current) {
      const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className={className}>
      <SectionHeader
        eyebrow="Press Archive"
        title="A Record of Recognition, Reach, and Relevance"
        align="center"
        as="h2"
        size="h2"
        className="mb-10 w-full"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/20">
        <TabList className="justify-start gap-[clamp(2rem,3vw,2.5rem)] [border-bottom:none]">
          {categories.map((cat) => (
            <Tab
              key={cat}
              id={`news-tab-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              isActive={activeCategory === cat}
              panelId="news-archive-panel"
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </Tab>
          ))}
        </TabList>
        <p className="shrink-0 font-body text-body-sm text-secondary">
          Showing {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        ref={gridRef}
        id="news-archive-panel"
        role="tabpanel"
        className="mt-8 grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {paginated.map((item) => (
          <NewsCard
            key={item.id}
            title={item.title}
            tag_image={item.tag_image}
            tag_text={item.tag_text}
            tag_link={item.tag_link}
            featured_image={item.featured_image}
            news_date={item.news_date}
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
