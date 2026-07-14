import EventCard from "@/components/ui/EventCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { RelatedEventsSectionProps } from "./RelatedEventsSection.types";

export default function RelatedEventsSection({ events, className = "" }: RelatedEventsSectionProps) {
  if (!events.length) return null;

  return (
    <div className={className}>
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader eyebrow="More from Torque" title="Explore the Experiences Shaping Our Story" />
        <div className="shrink-0">
          <SplitButton variant="primary" href="/events">
            View All Events
          </SplitButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.slug}
            slug={event.slug}
            title={event.title}
            featured_image={event.featured_image}
            tag={event.tag ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}
