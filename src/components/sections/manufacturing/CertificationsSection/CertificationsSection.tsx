import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { CertificationsSectionProps } from "./CertificationsSection.types";

export default function CertificationsSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: CertificationsSectionProps) {
  return (
    <div className={`flex flex-col items-center gap-12 text-center ${className}`}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        align="center"
        className="max-w-4xl"

      />

      <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
        {items.map((item, i) => (
          <div key={i} className="relative h-28 w-28 shrink-0 lg:h-36 lg:w-36">
            <Image
              src={item.image}
              alt={`Certification ${i + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
