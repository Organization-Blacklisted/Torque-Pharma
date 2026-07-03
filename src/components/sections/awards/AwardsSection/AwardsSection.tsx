"use client";

import { useState } from "react";
import AccreditationCard from "@/components/ui/AccreditationCard";
import CertCard from "@/components/ui/CertCard";
import CertLightbox from "@/components/ui/CertLightbox";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import type { AwardsSectionProps } from "./AwardsSection.types";

export default function AwardsSection({
  data: { eyebrow, subtitle, description, sections },
  className = "",
}: AwardsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleTabChange = (index: number) => {
    if (index === activeIndex) return;
    setLightboxIndex(null);
    setActiveIndex(index);
    setFading(true);
    setTimeout(() => {
      setDisplayedIndex(index);
      setFading(false);
    }, 150);
  };

  const activeSection = sections[displayedIndex];
  const certItems = activeSection?.variant === "certification"
    ? activeSection.items.map((item) => ({ image: item.image, label: item.title }))
    : [];

  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={subtitle}
        description={description}
        align="center"
        size="h1"
        as="h1"
        className="mx-auto mb-10 max-w-[1080px]"
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
        className={`transition-opacity duration-150 ease-in-out ${
          activeSection?.variant === "accreditation"
            ? "flex flex-wrap justify-center gap-[var(--spacing-gutter)]"
            : "mx-auto grid max-w-[1177px] grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 md:grid-cols-3"
        } ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {activeSection?.items.map((item, i) =>
          activeSection.variant === "accreditation" ? (
            <AccreditationCard
              key={item.title}
              image={item.image}
              title={item.title}
              desc={item.desc}
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)]"
            />
          ) : (
            <CertCard
              key={item.title}
              image={item.image}
              label={item.title}
              onClick={() => setLightboxIndex(i)}
            />
          )
        )}
      </div>

      {lightboxIndex !== null && certItems.length > 0 && (
        <CertLightbox
          items={certItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev !== null ? prev - 1 : null))}
          onNext={() => setLightboxIndex((prev) => (prev !== null ? prev + 1 : null))}
        />
      )}
    </div>
  );
}
