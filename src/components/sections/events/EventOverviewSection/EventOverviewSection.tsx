import type { EventOverviewSectionProps } from "./EventOverviewSection.types";

export default function EventOverviewSection({ overview, className = "" }: EventOverviewSectionProps) {
  return (
    <div className={className}>
      <h2 className="font-heading text-h2 font-light text-primary">{overview.title}</h2>
      <p className="mt-4 font-body text-body font-light leading-relaxed text-secondary">
        {overview.desc}
      </p>

      {overview.items.length > 0 && (
        <div className="mt-10 w-full overflow-x-auto">
          <div className="inline-flex divide-x divide-black/10 border-y border-black/10">
            {overview.items.map((item) => (
              <div key={item.title} className="flex-1 py-6 pr-6 first:pl-0 sm:pr-10 [&:not(:first-child)]:pl-6 sm:[&:not(:first-child)]:pl-10">
                <p className="font-heading font-normal leading-none text-mint" style={{ fontSize: "clamp(3rem, 6vw, 5.625rem)" }}>{item.count}</p>
                <p className="mt-1 font-body text-body-sm text-secondary">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
