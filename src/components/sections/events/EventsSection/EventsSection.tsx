"use client";

import { useMemo, useRef, useState } from "react";
import EventCard from "@/components/ui/EventCard";
import FeaturedEventSlider from "@/components/ui/FeaturedEventSlider";
import Pagination from "@/components/ui/Pagination";
import SectionHeader from "@/components/ui/SectionHeading";
import type { EventsSectionProps } from "./EventsSection.types";

const PER_PAGE = 6;

export default function EventsSection({ events, className = "" }: EventsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const featuredEvents = useMemo(() => events.filter((e) => e.is_featured), [events]);
  const regularEvents = useMemo(() => events.filter((e) => !e.is_featured), [events]);

  const totalPages = Math.max(1, Math.ceil(regularEvents.length / PER_PAGE));
  const paginatedEvents = regularEvents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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
        eyebrow="Event Highlights"
        title="A Closer Look at the Moments Moving Torque Ahead"
        align="center"
        as="h1"
        size="h1"
        className="mx-auto mb-10 max-w-[1080px]"
      />

      <FeaturedEventSlider events={featuredEvents} className="mb-[var(--spacing-section)]" />

      <SectionHeader
        title="Capturing More from Our Recent Presence"
        align="left"
        as="h2"
        size="h2"
        className="mb-10"
      />

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {paginatedEvents.map((event) => (
          <EventCard
            key={event.id}
            slug={event.slug}
            title={event.title}
            featured_image={event.featured_image}
            tag={event.tag}
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
