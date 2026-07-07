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
 <div className="relative w-full text-center">
<div className="flex flex-col  gap-2 text-center">
  <div className="flex">
    <Image
      aria-hidden
      src="/images/icons/quote-left.svg"
      alt=""
      width={56}
      height={56}
      className="h-[clamp(36px,4vw,56px)] w-[clamp(36px,4vw,56px)] shrink-0"
    />

    <p className="text-h3 italic font-normal leading-[1.3] text-secondary mb-4">
      {quote}
    </p>
        <Image
      aria-hidden
      src="/images/icons/quote-right.svg"
      alt=""
      width={56}
      height={56}
      className="h-[clamp(36px,4vw,56px)] w-[clamp(36px,4vw,56px)] shrink-0 self-end"
    />
    </div>
     <p className="text-body font-medium text-secondary">
    {attribution}
  </p>

  </div>
</div>
      </div>
    </div>
  );
}
