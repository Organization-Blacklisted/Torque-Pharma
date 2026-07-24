import Link from "next/link";
import { SplitButton } from "@/components/ui/SplitButton";
import { socialLinks } from "@/components/layouts/Footer/footer.icons";
import type { EventSidebarSectionProps } from "./EventSidebarSection.types";

const ExternalArrow = () => (
  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path
      d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.3"
    />
  </svg>
);

export default function EventSidebarSection({
  upcomingEvents,
  latestNews,
  className = "",
}: EventSidebarSectionProps) {
  return (
    <aside className={`flex flex-col gap-6 lg:sticky lg:top-32 ${className}`}>
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="rounded-lg border border-[#C6CCD8] bg-surface p-[var(--spacing-card)]">
          <h3 className="mb-6 font-heading text-h3 font-light text-primary">
            Upcoming Events Near You
          </h3>
          <div className="flex flex-col divide-y divide-[#C6CCD8]/80">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-3 py-6 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-4">
                  <p className="font-body text-body font-normal leading-[24px] text-primary line-clamp-2">
                    {event.title}
                  </p>
                  <p className="font-body text-h5 font-light leading-[24px] text-secondary">
                    {event.event_date}{event.tag ? ` • ${event.tag}` : ""}
                  </p>
                </div>
                <Link
                  href={`/events/${event.slug}`}
                  aria-label={`View event: ${event.title}`}
                  className="mt-1 shrink-0 rounded-lg border border-mint p-5 text-mint transition-colors duration-200 hover:bg-mint hover:text-white"
                >
                  <ExternalArrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <div className="rounded-lg border border-[#C6CCD8] p-[var(--spacing-card)]">
          <h3 className="mb-6 font-heading text-h3 font-light text-primary">
            Latest News &amp; Media
          </h3>
          <div className="flex flex-col divide-y divide-[#C6CCD8]/80">
            {latestNews.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 py-6 first:pt-0 last:pb-0">
                {item.tag_text && (
                  <span className="inline-flex h-8 w-fit items-center rounded-full bg-mint px-3.5 py-1 font-body text-h5 font-normal capitalize text-mint-dark">
                    {item.tag_text}
                  </span>
                )}
                <p className="font-body text-body font-normal leading-[24px] text-secondary line-clamp-2">
                  <Link href={`/news-and-media/${item.slug}`} className="transition-colors hover:text-mint">
                    {item.title}
                  </Link>
                </p>
                <p className="font-body text-h5 font-normal leading-[24px] text-primary">{item.news_date}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <SplitButton href="/news-and-media" variant="primary">
              Explore All News
            </SplitButton>
          </div>
        </div>
      )}

      {/* Join Our Community */}
      <div className="rounded-lg border border-[#C6CCD8] bg-surface p-[var(--spacing-card)]">
        <h3 className="mb-6 font-heading text-h3 font-light text-primary">
          Join Our Community
        </h3>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-mint/30 text-mint transition-colors duration-200 hover:border-mint hover:bg-mint hover:text-white"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
