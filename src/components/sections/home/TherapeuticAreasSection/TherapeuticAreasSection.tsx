"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";
import MobileSlider from "@/components/ui/MobileSlider";
import { SplitButton } from "@/components/ui/SplitButton";
import Container from "@/components/layouts/Container";
import type { TherapeuticAreasSectionProps } from "./TherapeuticAreasSection.types";

gsap.registerPlugin(ScrollTrigger);

// Selector hooks for the animation below — passed to CategoryCard's
// imageClassName/labelClassName rather than touching the shared component
// itself, since CategoryCard is also used (unanimated) on the Global
// Presence page.
const IMAGE_HOOK = "js-therapeutic-image";
const LABEL_HOOK = "js-therapeutic-label";
const DURATION = 1.6;

export default function TherapeuticAreasSection({
  data: { eyebrow, heading, description, items, cta },
  className = "",
}: TherapeuticAreasSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Images rise up from below and fade in together (translate + fade,
  // expo.out — same technique as the Torque Lineup cards below, just from
  // the bottom instead of the sides). The label underneath stays put and
  // only fades in once the image finishes rising. Fires once, the first
  // time the row is scrolled into view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const images = grid.querySelectorAll<HTMLElement>(`.${IMAGE_HOOK}`);
    if (images.length === 0) return;

    const labels = grid.querySelectorAll<HTMLElement>(`.${LABEL_HOOK}`);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
        once: true,
      },
    });

    tl.fromTo(
      images,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, duration: DURATION, ease: "expo.out" },
      0
    );

    if (labels.length > 0) {
      tl.fromTo(
        labels,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        DURATION - 0.6
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [items]);

  return (
    <div className={className}>
      <Container size="wide">
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        variant="split"
        theme="light"
        size="h2"
        headingClassName="max-w-[715px]"
        className="mb-[var(--spacing-subsection)]"
      />

      <div ref={gridRef} className="overflow-hidden">
        <MobileSlider desktopClassName="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 md:grid-cols-4">
          {items.map((item) => (
            <CategoryCard
              key={item.title}
              image={item.image}
              title={item.title}
              href={item.href}
              imageClassName={IMAGE_HOOK}
              labelClassName={LABEL_HOOK}
            />
          ))}
        </MobileSlider>
      </div>

      <div className="mt-[var(--spacing-subsection)] flex justify-center">
        <SplitButton variant="primary" href={cta.href}>
          {cta.label}
        </SplitButton>
      </div>
      </Container>
    </div>
  );
}
