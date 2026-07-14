import { apiFetch, type ApiResponse } from "./fetcher";
import type { Event } from "@/types/event";
import type { EventDetail } from "@/types/event-detail";

const STORAGE_BASE = process.env.API_URL!.replace(/\/api$/, "/storage");

export async function getEvents(): Promise<Event[]> {
  const { data } = await apiFetch<ApiResponse<Event[]>>("/events", {
    revalidate: 3600,
    tags: ["events"],
  });

  return data.map((event) => ({
    ...event,
    featured_image: event.featured_image.startsWith("http")
      ? event.featured_image
      : `${STORAGE_BASE}/${event.featured_image}`,
  }));
}

export async function getEventDetail(slug: string): Promise<EventDetail> {
  const { data } = await apiFetch<ApiResponse<EventDetail>>(`/events/${slug}`, {
    revalidate: 3600,
    tags: [`event-${slug}`, "events"],
  });
  return data;
}
