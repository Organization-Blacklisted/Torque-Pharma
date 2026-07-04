import Image from "next/image";
import type { BlogPostHeroProps } from "./BlogPostHero.types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostHero({ post, className = "" }: BlogPostHeroProps) {
  const { title, short_description, featured_image, category, medically_reviewed_by, publish_date } = post;

  return (
    <div className={`grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[7fr_3fr] lg:gap-16 ${className}`}>
      {/* Left — text */}
      <div className="flex flex-col justify-center gap-6">
        {category && (
          <span className="inline-flex w-fit items-center rounded-full bg-mint px-4 py-1.5 text-button font-medium uppercase tracking-wider text-white">
            {category.name}
          </span>
        )}

        <h1 className="font-heading text-h1 font-light leading-[1.1] text-white">
          {title}
        </h1>

        {short_description && (
          <p className="text-body text-white/60">{short_description}</p>
        )}

        <div className="flex items-center gap-4 text-body-sm text-white">
          {medically_reviewed_by && (
            <>
              <span className="italic underline">by {medically_reviewed_by}</span>
              <span>|</span>
            </>
          )}
          <span>{formatDate(publish_date)}</span>
        </div>
      </div>

      {/* Right — square image, matches Figma 540×540 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          src={featured_image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
         
        />
      </div>
    </div>
  );
}
