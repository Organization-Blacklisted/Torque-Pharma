import type { EventImpressionsSectionProps } from "./EventImpressionsSection.types";

export default function EventImpressionsSection({ section, className = "" }: EventImpressionsSectionProps) {
  return (
    <div className={className}>
      <h2 className="mb-8 font-heading text-h2 font-light text-primary">{section.title}</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-black/10 p-[var(--spacing-card)]"
          >
            <h3 className="font-body text-body font-medium text-primary">{item.title}</h3>
            <p className="mt-3 font-body text-body-sm font-light leading-relaxed text-secondary">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
