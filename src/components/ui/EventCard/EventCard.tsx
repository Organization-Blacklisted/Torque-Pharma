import Image from "next/image";
import Link from "next/link";
import type { EventCardProps } from "./EventCard.types";

export default function EventCard({ slug, title, featured_image, tag, className = "" }: EventCardProps) {
  const href = `/events/${slug}`;

  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className="overflow-hidden rounded-lg">
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

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {tag && (
          <span className="inline-flex h-8 w-fit items-center rounded-full bg-mint px-3.5 py-1 text-h5 font-normal capitalize text-mint-dark">
            {tag}
          </span>
        )}

        <h3 className="font-body font-medium text-body text-secondary">
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
      </div>

    </article>
  );
}
