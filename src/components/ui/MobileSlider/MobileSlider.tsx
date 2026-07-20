"use client";

import { Children, isValidElement, useEffect, useRef, useState, type CSSProperties } from "react";
import type { MobileSliderProps } from "./MobileSlider.types";

export default function MobileSlider({
  children,
  desktopClassName = "",
  peek = 24,
  gap = 16,
  className = "",
  ariaLabel = "Carousel",
}: MobileSliderProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const count = slides.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Track the most-visible slide (for the dots). Mobile-only in effect: on
  // desktop every cell is fully visible so `active` stays 0 and the dots are
  // hidden via `sm:hidden` anyway. Skips entirely for a single slide.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;

    const ratios = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.msIdx);
          ratios.set(idx, entry.intersectionRatio);
        }
        let best = 0;
        let bestRatio = -1;
        ratios.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        });
        setActive(best);
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 1] },
    );

    const cells = cellRefs.current.filter((c): c is HTMLDivElement => c !== null);
    cells.forEach((cell) => io.observe(cell));
    return () => io.disconnect();
  }, [count]);

  const goTo = (index: number) => {
    const cell = cellRefs.current[index];
    if (!cell) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cell.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className={`mobile-slider ${desktopClassName}`}
        style={{ "--ms-peek": `${peek}px`, "--ms-gap": `${gap}px` } as CSSProperties}
        role={count > 1 ? "group" : undefined}
        aria-roledescription={count > 1 ? "carousel" : undefined}
        aria-label={count > 1 ? ariaLabel : undefined}
      >
        {slides.map((child, i) => (
          <div
            key={i}
            data-ms-idx={i}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            className="mobile-slider__col"
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 min-[450px]:hidden">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                i === active ? "bg-mint" : "bg-mint/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
