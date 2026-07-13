import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { NewsAwardsSectionProps } from "./NewsAwardsSection.types";

const AWARDS = [
  {
    src: "/images/news/most-trusted-brand-icon.svg",
    alt: "Most Trusted Brands of India 3rd Edition 2023",
    caption: "The Most Trusted Brand in India by Marksmen",
  },
  {
    src: "/images/news/myfm-excellence.svg",
    alt: "MY FM Excellence Award",
    caption: "MY FM Excellence Award for 'Most Trusted Corporate Brand in Pharma'",
  },
  {
    src: "/images/news/et-edge-award.svg",
    alt: "ET Edge Best Health Care Brand Award",
    caption: "ET Edge Best Health Care Brand award",
  },
];

export default function NewsAwardsSection({ className = "" }: NewsAwardsSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow="Awards & Recognition"
        title="Accolades That Honour Years of Progress"
        description="Our achievements reflect a consistent approach to manufacturing excellence, product reliability, and healthcare responsibility."
        align="center"
        as="h2"
        size="h2"
        className="mb-[var(--spacing-section-inner)] w-full"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {AWARDS.map((award) => (
          <div key={award.src} className="flex flex-col items-center gap-6">
            <div className="relative aspect-[402/347] w-full rounded-xl">
              <Image
                src={award.src}
                alt={award.alt}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-center font-body text-body font-normal text-secondary">
              {award.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
