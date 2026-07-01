import Image from "next/image";
import Link from "next/link";
import type { CategoryCardProps } from "./CategoryCard.types";

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <path
        d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.3"
      />
    </svg>
  );
}

export default function CategoryCard({ image, title, href, className = "" }: CategoryCardProps) {
  const inner = (
    <div className={`group flex flex-col gap-3 ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-card-bg">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-body font-medium text-primary">{title}</p>
        <ArrowIcon />
      </div>
    </div>
  );

  if (href) return <Link href={href} aria-label={title}>{inner}</Link>;
  return inner;
}
