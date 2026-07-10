"use client";

import { useEffect, useRef } from "react";

interface CapabilityCardProps {
  title: string;
  subTitle: string;
  description: string;
  dark?: boolean;
  standalone?: boolean;
  className?: string;
}

function parseTitle(raw: string) {
  const spanMatch = raw.match(/<span>(.*?)<\/span>/i);
  const numMatch = raw.match(/^(\d+(?:\.\d+)?)/);
  const num = numMatch?.[1] ?? "";
  const numericPart = num ? parseFloat(num) : NaN;
  const word = spanMatch?.[1] ?? "";
  const trail = !word && num ? raw.slice(num.length) : "";
  return { num, numericPart, word, trail };
}

export default function CapabilityCard({
  title,
  subTitle,
  description,
  dark = false,
  standalone = true,
  className = "",
}: CapabilityCardProps) {
  const { num, numericPart, word, trail } = parseTitle(title);
  const canAnimate = !isNaN(numericPart);

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
          const el = valueRef.current;
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (el) el.textContent = String(Math.round(eased * numericPart));
            if (progress < 1) rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => { observer.disconnect(); cancelAnimationFrame(rafId); };
  }, [canAnimate, numericPart]);

  return (
    <div
      ref={cardRef}
      className={`flex h-full flex-col gap-[var(--spacing-gutter)] p-[var(--spacing-subsection)] ${
        standalone
          ? `rounded-lg border ${dark ? "border-dark-blue bg-dark-blue" : "border-black/10 bg-white/60"}`
          : ""
      } ${className}`}
    >
      <p className="font-heading text-h1 font-light leading-none text-mint">
        {num ? (
          <>
            <span ref={valueRef}>{canAnimate ? "0" : num}</span>
            {word && <span className="text-h3 font-light"> {word}</span>}
            {trail}
          </>
        ) : (
          title
        )}
      </p>
      <p className={`text-body font-medium ${dark ? "text-white" : "text-secondary"}`}>{subTitle}</p>
      <p className={`text-body-sm ${dark ? "text-white/60" : "text-secondary"}`}>{description}</p>
    </div>
  );
}
