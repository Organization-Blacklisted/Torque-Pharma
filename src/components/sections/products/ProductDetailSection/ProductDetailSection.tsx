"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import type { ProductDetailSectionProps } from "./ProductDetailSection.types";

const SLIDER_THRESHOLD = 2;

function ChevronLeft() {
  return (
    <svg width="16" height="14" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path
        d="M20.5776 9.42761L7.5901 9.4276L13.8401 3.1776L12.6609 1.99844L4.39844 10.2609L12.6609 18.5234L13.8401 17.3443L7.5901 11.0943L20.5776 11.0943V9.42761Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="14" viewBox="0 0 24 20" fill="none" aria-hidden="true">
      <path
        d="M3.4224 9.42761L16.4099 9.4276L10.1599 3.1776L11.3391 1.99844L19.6016 10.2609L11.3391 18.5234L10.1599 17.3443L16.4099 11.0943L3.4224 11.0943V9.42761Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ProductDetailSection({
  name,
  description,
  featuredImage,
  gallery,
  content,
  className = "",
}: ProductDetailSectionProps) {
  const [activeImage, setActiveImage] = useState<string | null>(featuredImage ?? gallery[0] ?? null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const showSlider = gallery.length > SLIDER_THRESHOLD;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Section first className={className}>
      <Container size="wide">
        <div className="grid items-start gap-[var(--spacing-section-inner)] lg:grid-cols-2">
          {/* Left: main image + gallery thumbnails */}
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/20">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {gallery.length > 0 && (
              <div className="mt-[var(--spacing-gutter)]">
                {!showSlider ? (
                  <div className="flex gap-[var(--spacing-gutter)]">
                    {gallery.map((img, i) => (
                      <button
                        key={img}
                        onClick={() => setActiveImage(img)}
                        aria-label={`View image ${i + 1}`}
                        className={`relative aspect-[4/3] flex-1 cursor-pointer border-2 bg-white/20 transition-opacity ${
                          activeImage === img
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${name} — view ${i + 1}`}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 33vw, 16vw"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div ref={emblaRef} className="overflow-hidden">
                      <div className="flex gap-[var(--spacing-gutter)]">
                        {gallery.map((img, i) => (
                          <div
                            key={img}
                            style={{ flex: "0 0 calc(50% - 12px)" }}
                          >
                            <button
                              onClick={() => setActiveImage(img)}
                              aria-label={`View image ${i + 1}`}
                              className={`relative block aspect-[4/3] w-full cursor-pointer border-2 bg-white/20 transition-opacity ${
                                activeImage === img
                                  ? "border-primary"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            >
                              <Image
                                src={img}
                                alt={`${name} — view ${i + 1}`}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 768px) 33vw, 16vw"
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canPrev}
                        aria-label="Previous images"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded bg-primary text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canNext}
                        aria-label="Next images"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded bg-primary text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: product name, description, content items */}
          <div>
            <h1 className="font-heading font-light text-h1 text-primary mb-4">
              {name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
            <p className="text-body text-secondary mb-8">{description}</p>

            <div className="divide-y divide-secondary/20">
              {content.map((item) => (
                <div key={item.title} className="py-5 first:pt-0 last:pb-0">
                  <p className="text-h4 font-medium leading-loose text-primary mb-1">{item.title}</p>
                  {/* description is pre-sanitized in the API transform (sanitizeRichText) */}
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: item.description }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
