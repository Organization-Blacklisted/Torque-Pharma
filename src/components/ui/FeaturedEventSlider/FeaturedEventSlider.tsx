"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";
import type { FeaturedEventSliderProps } from "./FeaturedEventSlider.types";

function FeaturedSlide({ event }: { event: Event }) {
  const href = `/events/${event.slug}`;

  return (
    <div className="grid overflow-hidden rounded-lg bg-white/20 md:h-[424px] md:grid-cols-2">
      <div className="flex flex-col justify-center gap-4 overflow-hidden p-[clamp(1.5rem,_3vw,_3rem)]">
        <span className="inline-flex h-8 w-fit items-center rounded-full bg-mint px-3.5 py-1 text-h6 font-medium uppercase text-white">
          Upcoming Event
        </span>

        <span className="text-h5 text-secondary">{event.event_date}</span>

        <h3 className="line-clamp-2 font-body text-h4 font-normal text-primary">
          <Link href={href}>{event.title}</Link>
        </h3>

        <p className="line-clamp-3 text-body text-secondary">{event.desc_text}</p>

        <div className="mt-2 flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
          <p className="text-body italic text-secondary/60">{event.created_by}</p>

          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-2 font-body text-body-sm font-medium uppercase text-mint"
          >
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.3"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="relative aspect-[4/3] md:aspect-auto">
        <Image
          src={event.featured_image}
          alt={event.title}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default function FeaturedEventSlider({ events, className = "" }: FeaturedEventSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: events.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (events.length === 0) return null;

  return (
    <div className={className}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex cursor-grab active:cursor-grabbing">
          {events.map((event) => (
            <div key={event.id} className="min-w-0 flex-[0_0_100%]">
              <FeaturedSlide event={event} />
            </div>
          ))}
        </div>
      </div>

      {events.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {events.map((e, i) => (
            <button
              key={e.id}
              type="button"
              aria-label={`Show featured event ${i + 1}`}
              aria-current={i === selectedIndex}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                i === selectedIndex ? "bg-mint" : "bg-mint/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
