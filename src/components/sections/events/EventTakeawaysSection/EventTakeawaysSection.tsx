import type { EventTakeawaysSectionProps } from "./EventTakeawaysSection.types";

export default function EventTakeawaysSection({ section, className = "" }: EventTakeawaysSectionProps) {
  return (
    <div className={className}>
      <h2 className="mb-8 font-heading text-h2 font-light text-primary">{section.title}</h2>

      <div className="flex flex-col gap-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-5 border-l-[3px] border-l-mint bg-white/60 px-5 py-5"
          >
            <span className="w-16 shrink-0 font-heading text-h2 font-normal italic leading-[24px] text-mint/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-body text-body font-normal leading-[24px] text-secondary">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
