"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type { MarqueeProps } from "./Marquee.types";

export default function Marquee({
  items,
  separator = "·",
  speed = 80,
  className = "",
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef  = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(4); // safe SSR default

  useLayoutEffect(() => {
    const calc = () => {
      const singleW    = measureRef.current?.scrollWidth  ?? 0;
      const containerW = containerRef.current?.offsetWidth ?? 0;
      if (!singleW || !containerW) return;
      // Need at least (containerW / singleW) + 1 sets visible at once.
      // Double it so the -50% scroll always has a seamless second half.
      const needed = Math.ceil(containerW / singleW) + 1;
      setCopies(needed * 2);
    };

    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [items]);

  const renderSet = (keyPrefix: number) =>
    items.map((item, i) => (
      <span key={`${keyPrefix}-${i}`} className="flex items-center whitespace-nowrap">
        <span className="px-8 text-[100px] font-semibold text-mint/35">
          {item}
        </span>
        <span className="text-[100px] font-semibold text-mint/35" aria-hidden="true">
          {separator}
        </span>
      </span>
    ));

  return (
    <div ref={containerRef} className={`relative overflow-x-hidden ${className}`}>
      {/* Hidden single set — measured to calculate copy count */}
      <div
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 flex w-max"
        aria-hidden="true"
      >
        {renderSet(-1)}
      </div>

      {/* Animated track */}
      <div
        className="flex w-max will-change-transform animate-[marquee_var(--marquee-speed)_linear_infinite]"
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <span key={i} className="flex">
            {renderSet(i)}
          </span>
        ))}
      </div>
    </div>
  );
}
