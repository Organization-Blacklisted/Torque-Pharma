"use client";

import { useEffect, useRef } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!canAnimate) return;

    let rafId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const start = performance.now();
          const decimals = (String(numericPart).split(".")[1] ?? "").length;
          const el = valueRef.current;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const raw = eased * numericPart;
            const formatted = decimals > 0 ? raw.toFixed(decimals) : String(Math.round(raw));
            if (el) el.textContent = `${formatted}${trail}`;
            if (progress < 1) rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
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
          ref={valueRef}
          className={`
            font-heading
            text-xl-h
            leading-none
            ${isDark ? "text-mint" : "text-mint"}
          `}
        >
          {canAnimate ? `0${trail}` : value}
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
