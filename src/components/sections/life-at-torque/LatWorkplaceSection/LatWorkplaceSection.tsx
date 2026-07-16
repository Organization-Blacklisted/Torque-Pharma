"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import type { LatWorkplaceSectionProps } from "./LatWorkplaceSection.types";

export default function LatWorkplaceSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: LatWorkplaceSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = (i: number) => {
    if (i === activeIndex) return;
    if (swapTimer.current) clearTimeout(swapTimer.current);

    setActiveIndex(i);
    setFading(true);

    swapTimer.current = setTimeout(() => {
      setDisplayedIndex(i);
      setFading(false);
    }, 150);
  };

  const active = items[displayedIndex];

  return (
    <Section className={className}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          variant="split"
          className="mb-10 lg:mb-14"
        />

        {/* Tab navigation */}
        <TabList className="mb-6">
          {items.map((item, i) => (
            <Tab
              key={i}
              isActive={activeIndex === i}
              onClick={() => handleTabChange(i)}
              id={`workplace-tab-${i}`}
              panelId="workplace-panel"
              className="px-4 normal-case"
            >
              {item.title}
            </Tab>
          ))}
        </TabList>

        {/* Tab panel — fades on swap */}
        <div
          id="workplace-panel"
          role="tabpanel"
          aria-labelledby={`workplace-tab-${activeIndex}`}
          className={`flex flex-col lg:flex-row overflow-hidden rounded-lg lg:h-[500px] transition-opacity duration-150 ease-in-out ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Left: rich text — centered vertically, scrolls if content overflows */}
          <div className="flex-1 overflow-y-auto bg-white/30">
            <div className="flex min-h-full flex-col justify-center px-8 py-8 lg:px-10">
              {/* description is pre-sanitized in the API transform (sanitizeRichText) */}
              <div
                className="rich-text [&_span]:block [&_span]:mt-12 [&_span]:text-primary"
                dangerouslySetInnerHTML={{ __html: active.description }}
              />
            </div>
          </div>

          {/* Right: all images stacked — only active is visible.
              All rendered in DOM so browser caches them before user clicks. */}
          <div className="relative w-full h-[260px] lg:h-full lg:w-[48%] shrink-0 overflow-hidden bg-white">
            {items.map((item, i) => (
              item.image && (
                <Image
                  key={i}
                  src={item.image}
                  alt={item.title}
                  fill
                  loading="lazy"
                  className={`object-cover transition-opacity duration-150 ${
                    i === displayedIndex ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              )
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
