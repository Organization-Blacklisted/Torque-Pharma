"use client";

import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import SafeHtml from "@/components/ui/SafeHtml";
import type { HistTopSectionProps } from "./HistTopSection.types";

function ChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2884 15.071L5.63138 9.414L7.04538 8L11.9954 12.95L16.9454 8L18.3594 9.414L12.7024 15.071C12.5148 15.2585 12.2605 15.3638 11.9954 15.3638C11.7302 15.3638 11.4759 15.2585 11.2884 15.071Z"
        fill="#5BC4A0"
      />
    </svg>
  );
}

export default function HistTopSection({
  eyebrow,
  heading,
  description,
  image,
  journeyLabel,
  className = "",
}: HistTopSectionProps) {
  const handleScroll = () => {
    document.getElementById("history-journey")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`flex flex-col items-center gap-8 ${className}`}>
      <div className="flex flex-col items-center gap-5 text-center">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          align="center"
          as="h1"
          size="h1"
        />
        <SafeHtml
          html={description}
          className="text-body leading-relaxed text-secondary [&_strong]:font-semibold [&_strong]:text-primary"
        />
      </div>

      <div className="relative w-full overflow-hidden rounded-lg aspect-[16/9]">
        <Image
          src={image}
          alt={heading}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1065px"
        />
      </div>

      <button
        type="button"
        onClick={handleScroll}
        className="flex items-center gap-1 rounded-lg px-3 py-3 text-button font-medium uppercase tracking-wide text-primary transition-colors  hover:text-mint cursor-pointer"
      >
        {journeyLabel}
        <ChevronDown />
      </button>
    </div>
  );
}
