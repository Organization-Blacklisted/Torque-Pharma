"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import type { LatBuiltOnSectionProps } from "./LatBuiltOnSection.types";

export default function LatBuiltOnSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: LatBuiltOnSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Section className={className}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          variant="split"
          className="mb-10 lg:mb-14"
          headingClassName="capitalize max-w-[600px]"
        />

        {/* Negative right margin cancels Container's right padding so slider bleeds to viewport edge.
            Left edge stays locked to Container's content boundary — no manual pl needed. */}
        <div className="-mr-3 md:-mr-4 lg:-mr-8 overflow-hidden">
          <div ref={emblaRef}>
            <div className="flex gap-6 cursor-grab active:cursor-grabbing">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="w-[80vw] sm:w-[340px] lg:w-[402px] shrink-0"
                >
                  <div className="relative h-[220px] sm:h-[300px] lg:h-[415px] overflow-hidden rounded-lg bg-surface">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 340px, 402px"
                      />
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-body text-body font-medium leading-6 text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-4 font-body text-body font-normal leading-6 text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile dot indicators */}
        {scrollSnaps.length > 1 && (
          <div className="mt-8 flex justify-center gap-2 lg:hidden">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-primary/30"
                }`}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
