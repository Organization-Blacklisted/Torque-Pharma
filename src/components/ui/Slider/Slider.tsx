"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import type { SliderProps } from "./Slider.types";

const GAP = 24; // matches --spacing-gutter

function PrevArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path d="M20.5776 9.42761L7.5901 9.4276L13.8401 3.1776L12.6609 1.99844L4.39844 10.2609L4.9901 10.8484L5.5776 11.4401L12.6609 18.5234L13.8401 17.3443L7.5901 11.0943L20.5776 11.0943L20.5776 9.42761Z" fill="currentColor"/>
    </svg>
  );
}

function NextArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path d="M3.4224 9.42761L16.4099 9.4276L10.1599 3.1776L11.3391 1.99844L19.6016 10.2609L19.0099 10.8484L18.4224 11.4401L11.3391 18.5234L10.1599 17.3443L16.4099 11.0943L3.4224 11.0943L3.4224 9.42761Z" fill="currentColor"/>
    </svg>
  );
}

export default function Slider({ children, visibleCount = 3, className = "" }: SliderProps) {
  const items = React.Children.toArray(children);
  const total = items.length;
  const maxIndex = Math.max(0, total - visibleCount);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const calcItemWidth = useCallback(() => {
    if (!trackRef.current) return;
    const w = (trackRef.current.offsetWidth - (visibleCount - 1) * GAP) / visibleCount;
    setItemWidth(w);
  }, [visibleCount]);

  useEffect(() => {
    calcItemWidth();
    const ro = new ResizeObserver(calcItemWidth);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [calcItemWidth]);

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  const translateX = currentIndex * (itemWidth + GAP);
  const showing = Math.min(currentIndex + visibleCount, total);
  const progress = (showing / total) * 100;

  return (
    <div className={className}>
      {/* Scrolling track */}
      <div className="overflow-hidden" ref={trackRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ gap: `${GAP}px`, transform: `translateX(-${translateX}px)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{ width: itemWidth > 0 ? `${itemWidth}px` : `${100 / visibleCount}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6">
        <div className="relative h-[2px] w-full bg-white/20">
          <div
            className="absolute left-0 top-0 h-full bg-mint transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-end gap-4">
          <span className="text-body-sm text-white/60">
            Showing {showing}/{total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-30"
            >
              <PrevArrow />
            </button>
            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              aria-label="Next slide"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-mint disabled:cursor-not-allowed disabled:opacity-30"
            >
              <NextArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
