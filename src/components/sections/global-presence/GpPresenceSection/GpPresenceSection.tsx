"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { GpPresenceSectionProps } from "./GpPresenceSection.types";

const MAP_CONFIG: Record<string, { src: string; width: number; height: number }> = {
  africa:          { src: "/images/map/africa-map.svg",        width: 521, height: 528 },
  asia:            { src: "/images/map/asia-map.svg",          width: 825, height: 532 },
  "south-america": { src: "/images/map/south-america-map.svg", width: 334, height: 537 },
};

function ArrowUpRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0 text-mint opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      <path
        d="M3 13L13 3M13 3H5M13 3V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function useTabKeyNav(count: number, onSelect: (i: number) => void) {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (current + 1) % count;
    if (e.key === "ArrowLeft") next = (current - 1 + count) % count;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = count - 1;
    if (next !== null) { e.preventDefault(); tabs[next].focus(); onSelect(next); }
  };
}

export default function GpPresenceSection({
  eyebrow,
  heading,
  description,
  cta,
  regions,
  className = "",
}: GpPresenceSectionProps) {
  const [activeIndex, setActiveIndex]       = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [fading, setFading]                 = useState(false);
  const tabRefs  = useRef<(HTMLButtonElement | null)[]>([]);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeRegion = regions[displayedIndex];
  const mapConfig = MAP_CONFIG[activeRegion.slug] ?? null;

  const handleTabClick = (i: number) => {
    if (i === activeIndex) return;
    if (swapTimer.current) clearTimeout(swapTimer.current);
    const list = tabRefs.current[i]?.parentElement;
    if (list && tabRefs.current[i]) {
      const tab = tabRefs.current[i]!;
      list.scrollTo({ left: Math.max(0, tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2), behavior: "smooth" });
    }
    setActiveIndex(i);
    setFading(true);
    swapTimer.current = setTimeout(() => {
      setDisplayedIndex(i);
      setFading(false);
    }, 150);
  };

  return (
    <div className={className}>
      <Container size="wide">
        <div className="mb-[clamp(2rem,4vw,3.75rem)] grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="max-w-[600px] lg:col-span-7">
            <SectionHeader eyebrow={eyebrow} title={heading} />
          </div>
          <div className="lg:col-span-5">
            <p className="text-body leading-6 text-secondary">{description}</p>
          </div>
        </div>

        <div
          role="tablist"
          onKeyDown={useTabKeyNav(regions.length, (i) => { setActiveIndex(i); tabRefs.current[i]?.focus(); })}
          className="flex gap-[var(--spacing-subsection)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {regions.map((region, i) => (
            <button
              key={region.slug}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              id={`presence-tab-${i}`}
              tabIndex={activeIndex === i ? 0 : -1}
              aria-selected={activeIndex === i}
              aria-controls={`presence-panel-${i}`}
              onClick={() => handleTabClick(i)}
              className={`shrink-0 cursor-pointer border-b border-solid pb-1 pt-1 font-body text-body font-normal capitalize transition-colors duration-200 ${
                activeIndex === i
                  ? "border-mint text-primary"
                  : "border-transparent text-primary/60 hover:text-primary"
              }`}
            >
              {region.title}
            </button>
          ))}
        </div>

        <div className="mt-[var(--spacing-subsection)] flex items-center gap-2">
          <div className="h-[18px] w-[18px] shrink-0 rounded-[3.6px] bg-[#53BEE5]" />
          <span className="font-body text-h5 font-light leading-none text-[#474A5C]">Countries We Serve</span>
        </div>

        <div
          role="tabpanel"
          id={`presence-panel-${activeIndex}`}
          aria-labelledby={`presence-tab-${activeIndex}`}
          className={`mt-[var(--spacing-subsection)] grid gap-[var(--spacing-section-inner)] transition-opacity duration-150 ease-in-out ${mapConfig ? "md:grid-cols-2" : ""} ${fading ? "opacity-0" : "opacity-100"}`}
        >
          {mapConfig && (
            <div
              className="mx-auto flex h-[300px] w-full items-center justify-center overflow-hidden md:h-auto md:overflow-visible"
              style={{ maxWidth: mapConfig.width, maxHeight: mapConfig.height }}
            >
              <Image
                src={mapConfig.src}
                alt={`${activeRegion.title} map`}
                width={mapConfig.width}
                height={mapConfig.height}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
          )}

          <div className="flex snap-x snap-mandatory overflow-x-auto gap-[var(--spacing-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:content-start md:overflow-x-visible md:pb-0">
            {activeRegion.countries.map((country) => (
              <Link
                key={country.slug}
                href={`/country/${country.slug}`}
                className="group flex shrink-0 snap-start items-center gap-4 md:shrink md:min-w-0"
              >
                {country.flagImage ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={country.flagImage}
                      alt={country.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface">
                    <span className="text-body-sm font-medium text-secondary">
                      {country.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="border-b border-transparent font-body text-body text-secondary transition-colors duration-200 group-hover:border-mint">
                    {country.title}
                  </span>
                  <ArrowUpRight />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-[var(--spacing-section-inner)] flex justify-center">
          <SplitButton href={cta.href} variant="primary">
            {cta.label}
          </SplitButton>
        </div>
      </Container>
    </div>
  );
}
