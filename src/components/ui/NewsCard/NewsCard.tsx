import Image from "next/image";
import type { NewsCardProps } from "./NewsCard.types";

const ExternalArrow = () => (
  <svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.3"
    />
  </svg>
);

export default function NewsCard({
  title,
  tag_image,
  tag_text,
  tag_link,
  featured_image,
  news_date,
  className = "",
}: NewsCardProps) {
  const href = tag_link && tag_link !== "#" ? tag_link : undefined;

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-xl bg-white/40 ${className}`}>
      <div className="overflow-hidden">
        <div className="relative aspect-[544/300] bg-surface">
        {featured_image && (
          <Image
            src={featured_image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-[var(--spacing-gutter)]">
        {(tag_image || tag_text) && (
          <span className="inline-flex h-8 w-fit items-center gap-2 rounded-full bg-mint px-3.5 py-1">
            {tag_image && (
              <Image
                src={tag_image}
                alt={tag_text ?? ""}
                width={16}
                height={16}
                className="h-4 w-auto object-contain"
                unoptimized
              />
            )}
            {tag_text && (
              <span className="text-h5 font-normal uppercase text-mint-dark">{tag_text}</span>
            )}
          </span>
        )}

        <h3 className="flex-1 font-body text-body font-medium text-secondary">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        <div className="relative z-10 flex items-center justify-between gap-4">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              aria-hidden="true"
              className="inline-flex items-center gap-2 font-body text-body-sm font-medium uppercase text-mint"
            >
              Read Now <ExternalArrow />
            </a>
          ) : (
            <span />
          )}
          <span className="font-body text-h5 font-light text-secondary">{news_date}</span>
        </div>
      </div>
    </article>
  );
}
