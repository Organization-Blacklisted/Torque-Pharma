import Image from "next/image";
import Link from "next/link";
import { BlogCardProps } from "./BlogCard.types";

export default function BlogCard({
  slug,
  title,
  category,
  featured_image,
  className = "",
}: BlogCardProps) {
  const href = `/resources/blogs/${slug}`;

  return (
    <article className={`group relative flex flex-col ${className}`}>
      <div className="overflow-hidden rounded-lg">
        <div className="relative aspect-[4/3] bg-surface">
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

      <div className="mt-4 flex flex-col gap-3">
        {category && (
          <span className="inline-flex h-8 w-fit items-center rounded-full bg-mint px-3.5 py-1 text-h5 font-normal uppercase text-mint-dark">
            {category.name}
          </span>
        )}

        <h3 className="font-body font-medium text-h4 leading-[1.2] text-secondary">
          {/* Stretched link covers the entire card */}
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
      </div>

      {/* READ MORE — always visible on mobile, slides up on hover on desktop */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative z-10 mt-6 inline-flex items-center gap-2 font-body text-body-sm font-normal uppercase text-primary transition-all duration-300 ease-out lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
      >
        <span className="inline-flex items-center gap-2">
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          </svg>
        </span>
      </Link>
    </article>
  );
}
