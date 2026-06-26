"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import { HomeImpactSectionProps } from "./HomeImpactSection.types";

export default function HomeImpactSection({
  data: { eyebrow, heading, headingBold, tabs },
  className = "",
}: HomeImpactSectionProps) {
  const [activeSlug, setActiveSlug]       = useState(tabs[0].slug);
  const [displayedSlug, setDisplayedSlug] = useState(tabs[0].slug);
  const [fading, setFading]               = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = (slug: string) => {
    if (slug === activeSlug) return;
    if (swapTimer.current) clearTimeout(swapTimer.current);

    setActiveSlug(slug);
    setFading(true);

    swapTimer.current = setTimeout(() => {
      setDisplayedSlug(slug);
      setFading(false);
    }, 150);
  };

  const active = tabs.find((t) => t.slug === displayedSlug) ?? tabs[0];

  return (
    <div className={className}>
      <SectionHeader eyebrow={eyebrow} align="center" className="mb-10">
        <h2 className="mt-2 font-heading font-light text-h2 leading-[1.1] text-primary">
          {heading} <span className="font-medium">{headingBold}</span>
        </h2>
      </SectionHeader>

      <TabList className="mb-10 md:justify-center gap-[clamp(2rem,_3vw,_2.5rem)]">
        {tabs.map((tab) => (
          <Tab
            key={tab.slug}
            id={`impact-tab-${tab.slug}`}
            panelId="impact-tab-panel"
            isActive={activeSlug === tab.slug}
            onClick={() => handleTabChange(tab.slug)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <div
        id="impact-tab-panel"
        role="tabpanel"
        aria-labelledby={`impact-tab-${activeSlug}`}
        className={`grid grid-cols-1 items-center gap-10 transition-opacity duration-150 ease-in-out md:grid-cols-[5fr_6fr] md:gap-[clamp(3rem,_5vw,_5rem)] ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* All images rendered in the DOM — lazy-load when section enters viewport,
            so all are cached before the user clicks any tab. */}
        <div className="relative min-h-[280px] overflow-hidden rounded-lg bg-secondary/10 md:min-h-[380px]">
          {tabs.map((tab) => (
            <Image
              key={tab.slug}
              src={tab.image.src}
              alt={tab.image.alt}
              fill
              className={`object-cover ${
                tab.slug === displayedSlug ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          ))}
        </div>

        <div>
          <h3 className="font-heading font-light text-h3 leading-snug text-primary">
            {active.title}
          </h3>
          <p className="mt-5 text-body leading-6 text-secondary">
            {active.description}
          </p>
        </div>
      </div>
    </div>
  );
}
