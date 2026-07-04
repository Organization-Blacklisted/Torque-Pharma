import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { DealerEligibilitySectionProps } from "./DealerEligibilitySection.types";

export default function DealerEligibilitySection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: DealerEligibilitySectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        variant="split"
        className="mb-10"
      />
      <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white border border-primary/10 p-[var(--spacing-card)]"
          >
            <h3 className="font-body text-h4 font-medium text-primary mb-6">
              {item.title}
            </h3>
            <ul className="flex flex-col gap-4">
              {item.content.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Image
                    src="/images/shared-icons/document-icon.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-h5 text-secondary">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
