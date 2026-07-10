import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import CapabilityCard from "./CapabilityCard";
import type { GpExportCapabilitySectionProps } from "./GpExportCapabilitySection.types";

export default function GpExportCapabilitySection({
  eyebrow,
  heading,
  description,
  groups,
  className = "",
}: GpExportCapabilitySectionProps) {
  const row1 = groups[0]?.items ?? [];
  const row2 = groups[1]?.items ?? [];
  const featured = groups[2]?.items[0];

  return (
    <div className={`flex flex-col gap-[var(--spacing-gutter)] ${className}`}>
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        align="center"
        size="h2"
        theme="light"
      />

      {/* Row 1 — 3 cols, middle card dark */}
      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-3">
        {row1.map((item, i) => (
          <CapabilityCard
            key={item.subTitle}
            title={item.title}
            subTitle={item.subTitle}
            description={item.description}
            dark={i === 1}
          />
        ))}
      </div>

      {/* Row 2 — 2 cols */}
      <div className="grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2">
        {row2.map((item) => (
          <CapabilityCard
            key={item.subTitle}
            title={item.title}
            subTitle={item.subTitle}
            description={item.description}
          />
        ))}
      </div>

      {/* Row 3 — image + stat split */}
      {featured && (
        <div className="grid overflow-hidden rounded-lg border border-black/10 sm:grid-cols-[65%_1fr]">
          {featured.image && (
            <div className="relative min-h-[280px]">
              <Image
                src={featured.image}
                alt={featured.subTitle}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          )}
          <CapabilityCard
            title={featured.title}
            subTitle={featured.subTitle}
            description={featured.description}
            standalone={false}
            className="bg-white"
          />
        </div>
      )}
    </div>
  );
}
