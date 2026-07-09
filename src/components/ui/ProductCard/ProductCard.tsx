import Image from "next/image";
import Link from "next/link";
import type { ProductCardProps } from "./ProductCard.types";

export default function ProductCard({ name, slug, image, className = "" }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className={`group block rounded-lg bg-white/20 ${className}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="relative aspect-square overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              loading="lazy"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <p className="mt-16 font-body text-body font-normal text-primary leading-[24px]">
          {name}
        </p>
      </div>
    </Link>
  );
}
