"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandShowcaseCard from "@/components/ui/BrandShowcaseCard";
import MobileSlider from "@/components/ui/MobileSlider";
import SectionHeader from "@/components/ui/SectionHeading";
import type { TorqueLineupUpdatedSectionProps } from "./TorqueLineupUpdatedSection.types";

gsap.registerPlugin(ScrollTrigger);

// Selector hook for the animation below — passed to BrandShowcaseCard's
// className rather than touching the shared component itself.
const CARD_HOOK = "js-lineup-card";

export default function TorqueLineupUpdatedSection({
  data: { eyebrow, heading, description, items },
  className = "",
}: TorqueLineupUpdatedSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Left-column cards fly in from the left, right-column cards fly in from
  // the right, converging on their final grid position, per the Figma
  // reference. Column membership is inferred from index parity since the
  // grid is always exactly 2 columns wide. Only runs at the tablet
  // breakpoint and up, where that 2-column layout actually exists — below
  // it cards stack in the mobile slider instead. Fires once, the first
  // time the row is scrolled into view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 991px)").matches) return;

    const cards = grid.querySelectorAll<HTMLElement>(`.${CARD_HOOK}`);
    if (cards.length === 0) return;

    const left: HTMLElement[] = [];
    const right: HTMLElement[] = [];
    cards.forEach((card, i) => (i % 2 === 0 ? left : right).push(card));

    const scrollTrigger = {
      trigger: grid,
      start: "top 85%",
      once: true,
    };

    const tweens = [
      gsap.fromTo(
        left,
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.6, ease: "expo.out", stagger: 0.2, scrollTrigger }
      ),
      gsap.fromTo(
        right,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.6, ease: "expo.out", stagger: 0.2, scrollTrigger }
      ),
    ];

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [items]);

  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        content={description}
        align="center"
        size="h2"
        className="mb-[var(--spacing-subsection)] max-w-[830px] mx-auto"
      />
      <div ref={gridRef} className="overflow-x-hidden">
        <MobileSlider desktopClassName="grid grid-cols-2 gap-x-5 gap-y-[var(--spacing-gutter)]">
          {items.map((item) => (
            <BrandShowcaseCard key={item.badge} {...item} className={CARD_HOOK} />
          ))}
        </MobileSlider>
      </div>
    </div>
  );
}
