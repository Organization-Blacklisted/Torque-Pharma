import Image from "next/image";
import SafeHtml from "@/components/ui/SafeHtml";
import { SplitButton } from "@/components/ui/SplitButton";
import type { HomeOverviewSectionProps } from "./HomeOverviewSection.types";

export default function HomeOverviewSection({
  data: { eyebrow, image, description, cta },
  className = "",
}: HomeOverviewSectionProps) {
  return (
    <div className={className}>
      {/* Eyebrow */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-mint" />
          <span className="text-eyebrow font-medium uppercase text-primary">{eyebrow}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-mint" />
        </div>
      </div>

      {/* Split layout */}
      <div className="grid items-center gap-8 md:grid-cols-[auto_1px_1fr] md:gap-[clamp(1.5rem,_4vw,_3.75rem)]">
        {/* Image — the 40-years badge */}
        <div className="flex items-center justify-center">
          <Image
            src={image}
            alt={eyebrow}
            width={257}
            height={257}
            className="h-auto mix-blend-multiply"
          />
        </div>

        {/* Divider */}
        <div className="hidden self-stretch bg-primary md:block" />

        {/* Content */}
        <div>
          <SafeHtml
            html={description}
            className="text-lead leading-relaxed text-secondary [&_strong]:font-normal [&_strong]:italic [&_strong]:text-primary"
          />
        </div>
      </div>

      <div className="mt-[var(--spacing-subsection)] flex justify-center">
        <SplitButton variant="primary" href={cta.href}>
          {cta.label}
        </SplitButton>
      </div>
    </div>
  );
}
