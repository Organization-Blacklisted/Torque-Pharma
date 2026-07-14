import Image from "next/image";
import type { EventTestimonialsSectionProps } from "./EventTestimonialsSection.types";

function getInitials(name: string): string {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function EventTestimonialsSection({ section, className = "" }: EventTestimonialsSectionProps) {
  return (
    <div className={className}>
      <h2 className="mb-8 font-heading text-h2 font-light text-primary">{section.title}</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {section.items.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-5 rounded-xl border border-black/10 p-[var(--spacing-card)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint/20">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={26}
                    height={26}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-heading text-body font-semibold text-primary">
                    {getInitials(item.name)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-body text-body font-normal leading-[24px] text-primary">{item.name}</p>
                <p className="font-body text-h5 font-light leading-[24px] text-secondary">{item.designation}</p>
              </div>
            </div>

            <p className="font-body text-body font-light leading-relaxed text-secondary">
              {item.about}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
