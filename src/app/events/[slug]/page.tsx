import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvents, getEventDetail } from "@/lib/api/events";
import { getNews } from "@/lib/api/news";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import EventHeroSection from "@/components/sections/events/EventHeroSection";
import EventOverviewSection from "@/components/sections/events/EventOverviewSection";
import EventImpressionsSection from "@/components/sections/events/EventImpressionsSection";
import EventGallerySection from "@/components/sections/events/EventGallerySection";
import EventTakeawaysSection from "@/components/sections/events/EventTakeawaysSection";
import EventTestimonialsSection from "@/components/sections/events/EventTestimonialsSection";
import EventSidebarSection from "@/components/sections/events/EventSidebarSection";
import RelatedEventsSection from "@/components/sections/events/RelatedEventsSection";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventDetail(slug).catch(() => null);
  if (!event) return { title: "Event | Torque Pharma" };
  return {
    title: `${event.title} | Torque Pharma`,
    description: event.desc_text,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [event, allEvents, allNews] = await Promise.all([
    getEventDetail(slug).catch(() => null),
    getEvents().catch(() => []),
    getNews().catch(() => []),
  ]);

  if (!event || event.status !== "published") notFound();

  const upcomingEvents = allEvents
    .filter((e) => e.slug !== slug)
    .slice(0, 3);

  const latestNews = allNews.slice(0, 3);

  const relatedEvents = allEvents
    .filter((e) => e.slug !== slug)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    .slice(0, 3);

  return (
    <>
      <Section first>
        <Container size="xl">
          <EventHeroSection event={event} />
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
            {/* Left: all main sections stacked */}
            <div className="flex flex-col gap-[var(--spacing-section-inner)]">
              <EventOverviewSection overview={event.overview_section} />

              {event.impressions_section.items.length > 0 && (
                <EventImpressionsSection section={event.impressions_section} />
              )}

              <EventGallerySection section={event.gallery_section} />

              {event.takeaways_section.items.length > 0 && (
                <EventTakeawaysSection section={event.takeaways_section} />
              )}

              {event.testimonials_section.items.length > 0 && (
                <EventTestimonialsSection section={event.testimonials_section} />
              )}
            </div>

            {/* Right: sticky sidebar */}
            <EventSidebarSection
              upcomingEvents={upcomingEvents}
              latestNews={latestNews}
            />
          </div>
        </Container>
      </Section>

      {relatedEvents.length > 0 && (
        <Section>
          <Container size="wide">
            <RelatedEventsSection events={relatedEvents} />
          </Container>
        </Section>
      )}
    </>
  );
}
