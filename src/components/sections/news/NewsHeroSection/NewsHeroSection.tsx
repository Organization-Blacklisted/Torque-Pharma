import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { NewsHeroSectionProps } from "./NewsHeroSection.types";

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

export default function NewsHeroSection({ featured, editorsPicks, className = "" }: NewsHeroSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow="News & Media"
        title="The Spotlight on Our Journey"
        description="Follow Torque Pharma's latest announcements, media features, industry mentions, and updates from Torque Pharma's expanding presence."
        align="center"
        as="h1"
        size="h1"
        className="mx-auto mb-[var(--spacing-section-inner)] max-w-[1000px]"
      />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        {/* Featured article */}
        {featured && (
          <article className="group relative flex flex-col overflow-hidden rounded-lg border border-[#C6CCD8]/50">
            <div className="overflow-hidden">
              <div className="relative aspect-[1064/471] bg-surface">
                {featured.featured_image && (
                  <Image
                    src={featured.featured_image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {(featured.tag_image || featured.tag_text) && (
                  <span className="inline-flex h-8 w-fit items-center gap-2 rounded-full bg-mint px-3.5 py-1">
                    {featured.tag_image && (
                      <Image
                        src={featured.tag_image}
                        alt={featured.tag_text ?? ""}
                        width={16}
                        height={16}
                        className="h-4 w-auto object-contain"
                        unoptimized
                      />
                    )}
                    {featured.tag_text && (
                      <span className="text-h5 font-normal uppercase text-mint-dark">{featured.tag_text}</span>
                    )}
                  </span>
                )}
                {(featured.sub_title || featured.news_date) && (
                  <span className="inline-flex items-center gap-4 text-body-sm text-secondary">
                    {featured.sub_title && <span>{featured.sub_title}</span>}
                    {featured.sub_title && featured.news_date && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true" className="shrink-0">
                        <circle cx="4" cy="4" r="4" fill="rgba(91,196,160,0.50)" />
                      </svg>
                    )}
                    {featured.news_date && <span>{featured.news_date}</span>}
                  </span>
                )}
              </div>

              <h2 className="mt-8 font-body text-h4 font-medium text-secondary">{featured.title}</h2>

              {featured.tag_link && featured.tag_link !== "#" && (
                <a
                  href={featured.tag_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-[var(--spacing-subsection)] inline-flex items-center gap-2 font-body text-body-sm font-medium uppercase text-mint after:absolute after:inset-0"
                >
                  Read Now <ExternalArrow />
                </a>
              )}
            </div>
          </article>
        )}

        {/* Editor's Picks */}
        {editorsPicks.length > 0 && (
          <aside className="overflow-hidden rounded-xl bg-surface p-6 lg:p-8">
            <p className="mb-6 font-body text-body font-normal uppercase leading-[24px] tracking-[1.4px] text-primary">
              Editor&apos;s Picks
            </p>

            <div className="flex flex-col">
              {editorsPicks.map((item, i) => {
                const href = item.tag_link && item.tag_link !== "#" ? item.tag_link : undefined;
                return (
                  <div key={item.id} className="group flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="mt-4 shrink-0 font-heading text-h2 font-normal italic leading-[24px] text-mint/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex flex-1 flex-col">
                      {item.tag_text && (
                        <span className="font-body text-body-sm font-normal text-primary">
                          {item.tag_text}
                        </span>
                      )}
                      <p className="mt-1 font-body text-body font-medium leading-[26px] text-secondary line-clamp-2">
                        {item.title}
                      </p>
                      <div className="mt-[clamp(2rem,2vw,55px)] flex items-center gap-3">
                        <span className="font-body text-h5 font-light text-secondary">{item.news_date}</span>
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Read: ${item.title}`}
                            className="ml-auto rounded-lg border border-mint p-5 text-mint opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          >
                            <ExternalArrow />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
