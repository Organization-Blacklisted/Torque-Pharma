"use client";

import { useState } from "react";
import CertCard from "@/components/ui/CertCard";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import type { AwardsSectionProps } from "./AwardsSection.types";

export default function AwardsSection({
  data: { title, eyebrow, subtitle, description, sections },
  className = "",
}: AwardsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState(0);

  const handleTabChange = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setFading(true);
    setTimeout(() => {
      setDisplayedIndex(index);
      setFading(false);
    }, 150);
  };

  const activeSection = sections[displayedIndex];

  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={subtitle}
        description={description}
        align="center"
        size="h1"
        as="h1"
        className="mb-10"
      />

      <TabList className="mb-10 justify-center gap-[clamp(2rem,_3vw,_2.5rem)]">
        {sections.map((section, i) => (
          <Tab
            key={section.section_title}
            id={`awards-tab-${i}`}
            panelId="awards-tab-panel"
            isActive={activeIndex === i}
            onClick={() => handleTabChange(i)}
          >
            {section.section_title}
          </Tab>
        ))}
      </TabList>

      <div
        id="awards-tab-panel"
        role="tabpanel"
        aria-labelledby={`awards-tab-${activeIndex}`}
        className={`grid grid-cols-2 gap-[var(--spacing-gutter)] transition-opacity duration-150 ease-in-out md:grid-cols-3 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {activeSection?.items.map((item) => (
          <CertCard key={item.title} image={item.image} label={item.title} />
        ))}
      </div>
    </div>
  );
}
