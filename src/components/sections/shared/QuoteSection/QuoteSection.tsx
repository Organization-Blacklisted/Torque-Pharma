import Image from "next/image";
import type { QuoteSectionProps } from "./QuoteSection.types";

export default function QuoteSection({ quote, attribution, className = "" }: QuoteSectionProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Watermark — in normal flow, drives section height */}
      <div aria-hidden className="pointer-events-none flex justify-center">
        <Image
          src="/images/icons/large-quote-center.svg"
          alt=""
          width={504}
          height={504}
          className="w-full max-w-[504px]"
        />
      </div>

      {/* Content + quote marks — overlay centered on text block */}
      <div className="absolute inset-0 flex items-center">
        <div className="relative w-full px-16 text-center">
          <Image
            aria-hidden
            src="/images/icons/quote-left.svg"
            alt=""
            width={56}
            height={56}
            className="absolute left-0 top-0"
          />
          <p className="text-h3 italic font-normal leading-[1.3] text-secondary">{quote}</p>
          <p className="mt-6 text-body font-semibold text-secondary">{attribution}</p>
          <Image
            aria-hidden
            src="/images/icons/quote-right.svg"
            alt=""
            width={56}
            height={56}
            className="absolute bottom-0 right-0"
          />
        </div>
      </div>
    </div>
  );
}
