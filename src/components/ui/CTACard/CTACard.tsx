import Image from "next/image";
import { ArrowIcon } from "@/components/ui/SplitButton/ArrowIcon";
import type { CTACardProps } from "./CTACard.types";

export default function CTACard({ title, linkLabel, href, className = "" }: CTACardProps) {
  return (
    <div className={`relative flex flex-col justify-end overflow-hidden rounded-lg bg-dark-blue p-6 ${className}`}>
      <div className="pointer-events-none absolute left-5 top-5 h-16 w-16" aria-hidden>
        <Image
          src="/images/about/cta-icon.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <h3 className="font-heading text-[32px] font-light leading-tight text-white">{title}</h3>
      <a
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-eyebrow font-medium uppercase tracking-wide text-mint"
      >
        {linkLabel}
        <ArrowIcon className="h-3 w-3 text-mint" />
      </a>
    </div>
  );
}
