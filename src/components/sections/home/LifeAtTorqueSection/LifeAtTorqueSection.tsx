import ImageCycler from "@/components/ui/ImageCycler";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { LifeAtTorqueSectionProps } from "./LifeAtTorqueSection.types";

export default function LifeAtTorqueSection({
  data: { eyebrow, heading, description, stat, buttons, images },
  className = "",
}: LifeAtTorqueSectionProps) {
  return (
    <div
      className={`
        grid
        gap-[clamp(2.5rem,_5vw,_4rem)]
        lg:grid-cols-2
        lg:items-center
        ${className}
      `}
    >
      {/* ── Left: content ─────────────────────────────────── */}
      <div>
        <SectionHeader eyebrow={eyebrow} title={heading} size="h2" />
        <p className="mt-5 text-body leading-6 text-secondary">{description}</p>
        {/* Stack full-width below 640px so wrapped buttons align; inline (content
            width) at >=640px. */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {buttons.map((btn, i) => (
            <SplitButton
              key={btn.label}
              variant={i === 0 ? "primary" : "outline-dark"}
              href={btn.href}
              className="w-full sm:w-auto"
              labelClassName="max-sm:flex-1 max-sm:justify-center"
            >
              {btn.label}
            </SplitButton>
          ))}
        </div>
      </div>

      {/* ── Right: 3-column image grid ────────────────────── */}
      {/*
        Col 1  │ Col 2              │ Col 3
        ───────┼────────────────────┼────────────────────
        stat   │                    │
               │  img[1]  (flex:3)  │  img[3]  (flex:2)
        img[0] │                    │
        (flex) ├────────────────────┼────────────────────
               │  img[2]  (flex:2)  │  img[4]  (flex:3)
      */}
      <div className="flex h-[clamp(380px,_46vw,_560px)] gap-3 md:gap-6">

        {/* Col 1: stat → tall cycler */}
        <div className="flex w-[30%] shrink-0 flex-col gap-3 md:gap-6">
          <div className="shrink-0">
            <p className="font-heading font-light leading-none text-mint text-xl-h font-medium">
              {stat.value}
            </p>
            <p className="mt-2 text-body text-secondary">{stat.label}</p>
          </div>

          <ImageCycler
            images={images[0] ?? []}
            offset={0}
            sizes="(max-width: 768px) 30vw, 16vw"
            className="min-h-0 flex-1 rounded"
          />
        </div>

        {/* Col 2: tall top (flex:3) + short bottom (flex:2) */}
        <div className="flex flex-1 flex-col gap-3 md:gap-6">
          <ImageCycler
            images={images[1] ?? []}
            offset={700}
            sizes="(max-width: 768px) 33vw, 22vw"
            className="[flex:3] min-h-0 rounded"
          />
          <ImageCycler
            images={images[2] ?? []}
            offset={1400}
            sizes="(max-width: 768px) 33vw, 22vw"
            className="[flex:2] min-h-0 rounded"
          />
        </div>

        {/* Col 3: short top (flex:2) + tall bottom (flex:3) — inverted from col 2 */}
        <div className="flex flex-1 flex-col gap-3 md:gap-6">
          <ImageCycler
            images={images[3] ?? []}
            offset={2100}
            sizes="(max-width: 768px) 33vw, 22vw"
            className="[flex:2] min-h-0 rounded"
          />
          <ImageCycler
            images={images[4] ?? []}
            offset={2800}
            sizes="(max-width: 768px) 33vw, 22vw"
            className="[flex:3] min-h-0 rounded"
          />
        </div>
      </div>
    </div>
  );
}
