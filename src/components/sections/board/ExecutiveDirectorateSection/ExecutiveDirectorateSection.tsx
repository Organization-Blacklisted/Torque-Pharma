import Image from "next/image";
import type { ExecutiveDirectorateSectionProps, DirectorateItem } from "./ExecutiveDirectorateSection.types";

function DirectorCard({ item }: { item: DirectorateItem }) {
  return (
    <div className="rounded-lg bg-[#E9EFF7] overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-[var(--spacing-card)]">
        <h3 className="font-body text-[24px] font-medium leading-normal text-primary uppercase mb-1">
          {item.title}
        </h3>
        <p className="font-body text-h5 font-normal text-secondary mb-3">
          {item.designation}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {item.experts.map((e) => (
            <span
              key={e.text}
              className="rounded-full border border-mint bg-mint/[0.14] px-3 py-1 font-body text-body-sm font-normal text-mint-dark"
            >
              {e.text}
            </span>
          ))}
        </div>
        <p className="font-body text-body font-normal leading-6 text-secondary">
          {item.about}
        </p>
      </div>
    </div>
  );
}

export default function ExecutiveDirectorateSection({
  title,
  items,
  className = "",
}: ExecutiveDirectorateSectionProps) {
  return (
    <div className={className}>
      <h2 className="font-heading text-h2 font-light text-primary text-center mb-10">
        {title}
      </h2>
      <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2">
        {items.map((item) => (
          <DirectorCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}
