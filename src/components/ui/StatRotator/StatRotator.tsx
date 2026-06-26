"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StatCard from "../StatCard";
import { StatRotatorProps } from "./StatRotator.types";

const SLIDE_MS = 500;

export default function StatRotator({
  items,
  interval = 4000,
  className = "",
}: StatRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const slidingRef = useRef(false);
  activeRef.current = activeIndex;

  // Pause when element scrolls out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const advance = useCallback(() => {
    if (slidingRef.current) return;
    const cur = activeRef.current;
    const next = (cur + 1) % items.length;

    slidingRef.current = true;
    setPrevIndex(cur);
    setActiveIndex(next);
    setIsSliding(true);

    setTimeout(() => {
      slidingRef.current = false;
      setIsSliding(false);
      setPrevIndex(null);
    }, SLIDE_MS);
  }, [items.length]);

  // Only run interval when element is visible AND tab is in focus
  useEffect(() => {
    if (!isVisible || !isPageVisible || items.length <= 2) return;
    const t = setInterval(advance, interval);
    return () => clearInterval(t);
  }, [isVisible, isPageVisible, items.length, interval, advance]);

  const firstCurrent = items[activeIndex];
  const secondCurrent = items[(activeIndex + 1) % items.length];
  const firstPrev = prevIndex !== null ? items[prevIndex] : null;
  const secondPrev = prevIndex !== null ? items[(prevIndex + 1) % items.length] : null;
  const isFirstDotActive = activeIndex % 2 === 0;
  const prevDotActive = prevIndex !== null ? prevIndex % 2 === 0 : false;

  const enterAnim = "animate-[slideInRight_500ms_cubic-bezier(0.4,0,0.2,1)_forwards]";
  const exitAnim  = "animate-[slideOutLeft_500ms_cubic-bezier(0.4,0,0.2,1)_forwards]";

  return (
    <div
      ref={containerRef}
      className={`grid md:grid-cols-2 gap-[var(--spacing-gutter)] ${className}`}
    >
      {/* Slot 1 — card frame stays, content slides within */}
      <div className="relative overflow-hidden">
        {isSliding && firstPrev && (
          <div className={`absolute inset-0 ${exitAnim}`}>
            <StatCard {...firstPrev} showDots isFirstDotActive={prevDotActive} />
          </div>
        )}
        <StatCard
          {...firstCurrent}
          showDots
          isFirstDotActive={isFirstDotActive}
          className={isSliding ? enterAnim : ""}
        />
      </div>

      {/* Slot 2 — card frame stays, content slides within */}
      <div className="relative overflow-hidden">
        {isSliding && secondPrev && (
          <div className={`absolute inset-0 ${exitAnim}`}>
            <StatCard {...secondPrev} showDots isFirstDotActive={prevDotActive} />
          </div>
        )}
        <StatCard
          {...secondCurrent}
          showDots
          isFirstDotActive={isFirstDotActive}
          className={isSliding ? enterAnim : ""}
        />
      </div>
    </div>
  );
}
