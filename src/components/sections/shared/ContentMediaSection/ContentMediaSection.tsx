import Image from "next/image";
import RotatingPhotoBadge from "@/components/ui/RotatingPhotoBadge";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import VideoBackground from "@/components/ui/VideoBackground";
import { ContentMediaSectionProps } from "./ContentMediaSection.types";

function MediaBlock({
  media,
  layout,
  className = "",
}: Pick<ContentMediaSectionProps, "media" | "layout"> & { className?: string }) {
  const isCentered = layout === "centered";

  if (media.type === "rotating") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <RotatingPhotoBadge
          src={media.src}
          alt={media.alt}
          speed={media.speed}
          className="w-full max-w-[750px]"
        />
      </div>
    );
  }

  const fit = media.type === "image" ? (media.fit ?? "cover") : "cover";

  if (media.type === "image" && fit === "contain") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Image
          src={media.src}
          alt={media.alt}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="h-auto w-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-lg
        ${isCentered ? "aspect-[16/7] w-full" : "h-full min-h-[360px]"}
        ${className}
      `}
    >
      {media.type === "image" ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes={isCentered ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
        />
      ) : (
        <VideoBackground sources={media.sources} poster={media.poster} showAudioToggle />
      )}
    </div>
  );
}

function Actions({
  actions,
  centered,
}: {
  actions: ContentMediaSectionProps["actions"];
  centered: boolean;
}) {
  if (!actions?.length) return null;

  return (
    <div className={`mt-8 flex flex-wrap gap-4 ${centered ? "justify-center" : ""}`}>
      {actions.map((action) => (
        <SplitButton
          key={action.href}
          variant={action.variant ?? "primary"}
          href={action.href}
          external={action.external}
        >
          {action.label}
        </SplitButton>
      ))}
    </div>
  );
}

export default function ContentMediaSection({
  eyebrow,
  heading,
  description,
  note,
  layout,
  media,
  actions,
  headingAs = "h2",
  columnRatio = "2:3",
  columnGap = "40px",
  className = "",
  headerClassName = "",
  headingClassName = "",
  descriptionClassName = "",
}: ContentMediaSectionProps) {
  if (layout === "centered") {
    return (
      <div className={className}>
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          description={description}
          align="center"
          as={headingAs}
          size="h1"
          className={headerClassName}
          headingClassName={headingClassName}
          descriptionClassName={descriptionClassName}
        />
        <div className="mt-[var(--spacing-subsection)]">
          <MediaBlock media={media} layout={layout} />
        </div>
        <Actions actions={actions} centered />
      </div>
    );
  }

  const isLeft = layout === "split-left";

  return (
    <div
      className={`
        grid
        ${columnGap === "112px" ? "gap-[clamp(24px,_6vw,_112px)]" : "gap-[40px]"}
        ${columnRatio === "1:1" ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[2fr_3fr]"}
        md:items-center
        ${className}
      `}
    >
      {/* Image always comes first in DOM so mobile (stacked) always shows it
          before the text, regardless of which side it sits on at md+ — md:order
          restores the left/right split there. The order class goes directly on
          MediaBlock (not a wrapping div) because its h-full relies on being the
          direct grid item — CSS Grid resolves percentage heights against the
          grid area even on auto-sized tracks, but only for the item itself;
          an intermediate auto-height wrapper breaks that chain and the image
          collapses to its min-height instead of matching the text column. */}
      <MediaBlock media={media} layout={layout} className={isLeft ? "md:order-1" : "md:order-2"} />

      <div className={isLeft ? "md:order-2" : "md:order-1"}>
        {/* Description rendered manually — SectionHeader adds max-w-3xl which we don't want in a constrained column */}
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          align="left"
          as={headingAs}
          size={headingAs}
        />
        {description && (
          <p className="mt-5 text-body leading-6 text-secondary">
            {description}
          </p>
        )}
        {note && (
          <p className="mt-5 border-l-2 border-primary/60 pl-4 text-body-sm italic text-secondary/80">
            {note}
          </p>
        )}
        <Actions actions={actions} centered={false} />
      </div>
    </div>
  );
}
