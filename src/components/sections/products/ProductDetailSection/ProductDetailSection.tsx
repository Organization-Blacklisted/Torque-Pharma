"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import { SplitButton } from "@/components/ui/SplitButton";
import type { ProductDetailSectionProps } from "./ProductDetailSection.types";

const SLIDER_THRESHOLD = 2;

function DownloadIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" aria-hidden="true">
      <path
        d="M24.2442 16.2852C24.0204 16.2852 23.8058 16.3741 23.6476 16.5323C23.4894 16.6905 23.4005 16.9051 23.4005 17.1289V20.0103C23.4005 20.6895 23.1307 21.3408 22.6504 21.8211C22.1702 22.3013 21.5189 22.5711 20.8397 22.5711H6.15844C5.47928 22.5711 4.82793 22.3013 4.34769 21.8211C3.86745 21.3408 3.59766 20.6895 3.59766 20.0103V17.1289C3.59766 16.9051 3.50876 16.6905 3.35053 16.5323C3.19229 16.3741 2.97768 16.2852 2.75391 16.2852C2.53013 16.2852 2.31552 16.3741 2.15728 16.5323C1.99905 16.6905 1.91016 16.9051 1.91016 17.1289V20.0103C1.91127 21.1367 2.35922 22.2166 3.15568 23.0131C3.95215 23.8095 5.03207 24.2575 6.15844 24.2586H20.8397C21.9661 24.2575 23.046 23.8095 23.8424 23.0131C24.6389 22.2166 25.0869 21.1367 25.088 20.0103V17.1289C25.088 16.9051 24.9991 16.6905 24.8408 16.5323C24.6826 16.3741 24.468 16.2852 24.2442 16.2852Z"
        fill="currentColor"
      />
      <path
        d="M12.9027 18.7481C12.9811 18.8272 13.0744 18.89 13.1772 18.9328C13.2801 18.9757 13.3903 18.9977 13.5017 18.9977C13.6131 18.9977 13.7234 18.9757 13.8262 18.9328C13.929 18.89 14.0223 18.8272 14.1008 18.7481L18.9017 13.9472C19.0357 13.786 19.1048 13.5807 19.0958 13.3713C19.0867 13.162 19 12.9635 18.8526 12.8145C18.7052 12.6655 18.5076 12.5767 18.2983 12.5654C18.0891 12.5541 17.8831 12.6211 17.7205 12.7533L14.3455 16.1283V3.58594C14.3455 3.36216 14.2566 3.14755 14.0983 2.98932C13.9401 2.83108 13.7255 2.74219 13.5017 2.74219C13.2779 2.74219 13.0633 2.83108 12.9051 2.98932C12.7469 3.14755 12.658 3.36216 12.658 3.58594V16.1156L9.28297 12.7406C9.12465 12.5823 8.90992 12.4934 8.68602 12.4934C8.46212 12.4934 8.24739 12.5823 8.08906 12.7406C7.93074 12.8989 7.8418 13.1137 7.8418 13.3376C7.8418 13.5615 7.93074 13.7762 8.08906 13.9345L12.9027 18.7481Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
  slug,
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
              {name}
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

            <div className="js-download-pdf-block mt-8 border-t border-secondary/20 pt-8">
              <p className="mb-3 text-body-sm italic text-secondary">
                Download product information as a PDF
              </p>
              <SplitButton href={`/api/pdf/${slug}`} external icon={<DownloadIcon />}>
                Download PDF
              </SplitButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
