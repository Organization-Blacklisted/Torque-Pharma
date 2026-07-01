import Image from "next/image";
import { ArrowIcon } from "@/components/ui/SplitButton/ArrowIcon";
import type { CTACardProps } from "./CTACard.types";

export default function CTACard({ title, linkLabel, href, className = "" }: CTACardProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg bg-dark-blue p-6 ${className}`}>
      <div className="relative mb-6 h-16 w-16 shrink-0" aria-hidden>
        <Image
          src="/images/about/cta-icon.svg"
          alt=""
          fill
          className="object-contain animate-spin [animation-duration:4s]"
        />
      </div>
      <div className="flex-1" />
      <h3 className="font-heading text-h3 font-light leading-tight text-white">{title}</h3>
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
