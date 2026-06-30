"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import StatCard from "../StatCard";
import type { StatCardProps } from "../StatCard/StatCard.types";
import { StatRotatorProps } from "./StatRotator.types";

// One independent mini-carousel per card slot — rotates through that slot's own items only
function StatSlot({
  items,
  interval,
  active,
}: {
  items: StatCardProps[];
  interval: number;
  active: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef(Autoplay({ delay: interval }));
  const rotates = items.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: rotates }, rotates ? [autoplayRef.current] : []);

  useEffect(() => {
    if (!rotates) return;
    const autoplay = autoplayRef.current;
    if (active) autoplay.play();
    else autoplay.stop();
  }, [rotates, active]);

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

  return (
    <div className="min-w-0 overflow-hidden" ref={emblaRef}>
      <div className="-ml-[var(--spacing-gutter)] flex cursor-grab active:cursor-grabbing">
        {items.map((item, i) => (
          <div key={i} className="min-w-0 flex-[0_0_100%] pl-[var(--spacing-gutter)]">
            <StatCard {...item} showDots={rotates} isFirstDotActive={selectedIndex === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatRotator({ slots, interval = 4000, className = "" }: StatRotatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause when element scrolls out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div ref={containerRef} className={`grid gap-[var(--spacing-gutter)] md:grid-cols-2 ${className}`}>
      {slots.map((items, i) => (
        <StatSlot key={i} items={items} interval={interval} active={isVisible && isPageVisible} />
      ))}
    </div>
  );
}
