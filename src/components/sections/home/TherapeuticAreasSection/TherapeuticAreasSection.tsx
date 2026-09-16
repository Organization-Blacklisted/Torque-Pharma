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
const DURATION = 0.9;
const STAGGER = 0.15;

export default function TherapeuticAreasSection({
  data: { eyebrow, heading, description, items, cta },
  className = "",
}: TherapeuticAreasSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Each image grows upward from its bottom edge, like a bar rising — a
  // clip-path reveal (not a scale/translate of the whole card) so the photo
  // itself never stretches or distorts as it grows. The label below stays
  // hidden until its own card's image finishes growing, then fades in.
  // Cards are staggered a beat apart. Replays every time the row is
  // (re-)entered — scrolling down into it, or back up into it after having
  // scrolled past — not just the first time.
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
        end: "bottom top",
        toggleActions: "restart none restart none",
      },
    });

    tl.fromTo(
      images,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: DURATION,
        ease: "power2.out",
        stagger: STAGGER,
      },
      0
    );

    if (labels.length > 0) {
      tl.fromTo(
        labels,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: STAGGER,
        },
        DURATION
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

      <div ref={gridRef}>
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
