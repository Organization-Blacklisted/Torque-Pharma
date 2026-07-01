"use client";

import { useEffect, useRef, useState } from "react";
import { StatCardProps } from "./StatCard.types";

export default function StatCard({
  label,
  value,
  suffix,
  description,
  theme = "light",
  animated = false,
  className = "",
  showDots = false,
  isFirstDotActive = true,
}: StatCardProps) {
  const isDark = theme === "dark";

  // Split "40+" → numericPart=40, trail="+"  |  "40" → numericPart=40, trail=""
  const numericMatch = value.match(/^(\d+(?:\.\d+)?)(.*)/);
  const numericPart = numericMatch ? parseFloat(numericMatch[1]) : NaN;
  const trail = numericMatch ? numericMatch[2] : "";

  const canAnimate = animated && !isNaN(numericPart);
  const [displayValue, setDisplayValue] = useState(canAnimate ? `0${trail}` : value);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!canAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(`${Math.round(eased * numericPart)}${trail}`);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [canAnimate, numericPart, trail]);

  return (
    <div
      ref={cardRef}
      className={`
        flex
        h-full
        flex-col
        rounded-lg
        p-[clamp(1rem,2vw,2rem)]
        py-[clamp(1.5rem,2vw,2.5rem)]
        ${isDark ? "bg-dark-blue" : "bg-white"}
        ${className}
      `}
    >
      {showDots && (
        <div className="mb-4 flex gap-1">
          <span
            className={`
              h-2.5
              w-2.5
              rounded-full
              bg-mint
              ${isFirstDotActive ? "opacity-100" : "opacity-30"}
            `}
          />
          <span
            className={`
              h-2.5
              w-2.5
              rounded-full
              bg-mint
              ${!isFirstDotActive ? "opacity-100" : "opacity-30"}
            `}
          />
        </div>
      )}

      {label && (
        <div className="flex-grow">
          <p
            className={`
              text-button
              uppercase
              font-medium
              font-body
              ${isDark ? "text-white" : "text-lightgray"}
            `}
          >
            {label}
          </p>
        </div>
      )}

      <div className={`mb-3 ${label ? "mt-[80px]" : "mt-auto"}`}>
        <span
          className={`
            font-heading
            text-xl-h
            leading-none
            ${isDark ? "text-mint" : "text-mint"}
          `}
        >
          {displayValue}
        </span>
        {suffix && (
          <span
            className={`
              ml-1
              font-heading
              text-h3
              ${isDark ? "text-mint" : "text-mint"}
            `}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        className={`
          font-body
          text-body
          leading-6
          ${isDark ? "text-white/80" : "text-secondary"}
        `}
      >
        {description}
      </p>
    </div>
  );
}
