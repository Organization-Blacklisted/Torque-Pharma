"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { ResponsiveCount, SliderProps } from "./Slider.types";

const GAP = 24;  // matches gap-6 / --spacing-gutter
const PEEK = 50; // px of the next card always visible at the right edge

function resolveCount(count: ResponsiveCount, width: number): number {
  if (typeof count === "number") return count;
  if (width >= 1280 && count.xl != null) return count.xl;
  if (width >= 1024 && count.lg != null) return count.lg;
  if (width >= 768  && count.md != null) return count.md;
  if (width >= 640  && count.sm != null) return count.sm;
  return count.default;
}

// Computes the CSS flex-basis so N cards fill the container minus a fixed peek strip.
// Formula: N × w + (N−1) × GAP + GAP + PEEK = W  →  w = (W − N×GAP − PEEK) / N
//          expressed as a percentage: calc(100%/N − (GAP + PEEK/N)px)
function slideWidth(count: number): string {
  if (count === 1) return "85%"; // single-card: show a generous peek without math
  return `calc(${100 / count}% - ${GAP + PEEK / count}px)`;
}

function PrevArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <g clipPath="url(#prev-clip)">
        <path d="M20.5776 9.42761L7.5901 9.4276L13.8401 3.1776L12.6609 1.99844L4.39844 10.2609L4.9901 10.8484L5.5776 11.4401L12.6609 18.5234L13.8401 17.3443L7.5901 11.0943L20.5776 11.0943L20.5776 9.42761Z" fill="white" />
      </g>
      <defs>
        <clipPath id="prev-clip">
          <rect width="24" height="20" fill="white" transform="matrix(1 7.28523e-08 1.04907e-07 -1 0 20)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function NextArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <g clipPath="url(#next-clip)">
        <path d="M3.4224 9.42761L16.4099 9.4276L10.1599 3.1776L11.3391 1.99844L19.6016 10.2609L19.0099 10.8484L18.4224 11.4401L11.3391 18.5234L10.1599 17.3443L16.4099 11.0943L3.4224 11.0943L3.4224 9.42761Z" fill="white" />
      </g>
      <defs>
        <clipPath id="next-clip">
          <rect width="24" height="20" fill="white" transform="translate(24 20) rotate(180)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function Slider({
  children,
  visibleCount = 3,
  className = "",
  overflowVisible = false,
  showProgress = true,
  controlsAlign = "end",
}: SliderProps) {
  const items = useMemo(() => React.Children.toArray(children), [children]);
  const total = items.length;

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const effectiveCount = resolveCount(visibleCount, containerWidth);
  const width = slideWidth(effectiveCount);

  // Derived — no state needed; updates automatically when effectiveCount or selectedSnap changes
  const showing = Math.min(selectedSnap + effectiveCount, total);

  // Watch container width so effectiveCount stays accurate on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    setContainerWidth(el.offsetWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-initialise Embla whenever slide widths change (breakpoint crossing on resize)
  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, width]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const progress = total > 0 ? (showing / total) * 100 : 0;

  return (
    <div ref={containerRef} className={className}>
      <div className={overflowVisible ? "" : "overflow-hidden"} ref={emblaRef}>
        <div className="flex cursor-grab gap-6 active:cursor-grabbing">
          {items.map((item, i) => (
            <div key={i} style={{ flex: `0 0 ${width}` }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {showProgress && (
          <div className="relative h-[2px] w-full bg-white/20">
            <div
              className="absolute left-0 top-0 h-full bg-mint transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div
          className={`flex items-center gap-4 ${showProgress ? "mt-4" : ""} ${
            controlsAlign === "center"
              ? "justify-center"
              : controlsAlign === "start"
                ? "justify-start"
                : "justify-end"
          }`}
        >
          {showProgress && (
            <span className="text-body-sm text-white/60">Showing {showing}/{total}</span>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
              className="flex h-[53px] w-[53px] cursor-pointer items-center justify-center rounded bg-mint transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <PrevArrow />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next slide"
              className="flex h-[53px] w-[53px] cursor-pointer items-center justify-center rounded bg-mint transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <NextArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
