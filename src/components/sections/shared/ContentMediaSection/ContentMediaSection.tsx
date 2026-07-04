import Image from "next/image";
import RotatingPhotoBadge from "@/components/ui/RotatingPhotoBadge";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import VideoBackground from "@/components/ui/VideoBackground";
import { ContentMediaSectionProps } from "./ContentMediaSection.types";

function MediaBlock({
  media,
  layout,
}: Pick<ContentMediaSectionProps, "media" | "layout">) {
  const isCentered = layout === "centered";

  if (media.type === "rotating") {
    return (
      <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center">
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
  layout,
  media,
  actions,
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
        gap-[40px]
        md:grid-cols-[2fr_3fr]
        md:items-center
        ${className}
      `}
    >
      {isLeft && <MediaBlock media={media} layout={layout} />}

      <div>
        {/* Description rendered manually — SectionHeader adds max-w-3xl which we don't want in a constrained column */}
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          align="left"
          size="h1"
        />
        {description && (
          <p className="mt-5 text-body leading-6 text-secondary">
            {description}
          </p>
        )}
        <Actions actions={actions} centered={false} />
      </div>

      {!isLeft && <MediaBlock media={media} layout={layout} />}
    </div>
  );
}
