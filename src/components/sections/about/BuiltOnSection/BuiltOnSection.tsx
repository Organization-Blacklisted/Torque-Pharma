import AlternatingItemsList from "@/components/ui/AlternatingItemsList";
import type { BuiltOnSectionProps } from "./BuiltOnSection.types";

export default function BuiltOnSection({ eyebrow, subTitle, items, className = "" }: BuiltOnSectionProps) {
  return (
    <div className={className}>
      <div className="mb-[var(--spacing-section-inner)] flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-mint" />
          <span className="text-eyebrow font-medium uppercase text-primary">{eyebrow}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-mint" />
        </div>
        <h2
          className="font-heading font-light text-h2 leading-[1.1] text-primary [&_span]:font-normal"
          dangerouslySetInnerHTML={{ __html: subTitle }}
        />
      </div>

      <AlternatingItemsList items={items} headingFont="body" />
    </div>
  );
}
