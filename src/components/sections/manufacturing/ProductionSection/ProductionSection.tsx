"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { ProductionSectionProps } from "./ProductionSection.types";

export default function ProductionSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: ProductionSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div className={`flex flex-col gap-10 md:gap-14 ${className}`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-16">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <p className="text-body text-secondary md:self-end">{description}</p>
      </div>

      {/* Mobile accordion — below md */}
      <div className="md:hidden overflow-hidden rounded-lg bg-white/20">
        {items.map((item, i) => {
          const isOpen = i === activeIndex;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <p className={`font-body text-body text-primary ${isOpen ? "font-medium" : "font-normal"}`}>
                  {item.title}
                </p>
                <svg
                  className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                  <div className="px-6 pb-5">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="pt-4 text-body-sm text-secondary">{item.description}</p>
                  </div>
                </div>
              </div>

              {i < items.length - 1 && (
                <div className="mx-6 border-b border-secondary/20" />
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop two-column — md and above */}
      <div className="hidden md:grid md:grid-cols-2 overflow-hidden rounded-lg bg-white/20">
        <div className="flex flex-col px-6 py-[10px]">
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="w-full cursor-pointer text-left"
              >
                <div
                  className={`border-b px-6 transition-all duration-300 ${
                    isActive
                      ? "rounded-[6px] border-transparent bg-mint/20 my-5 py-6"
                      : `py-5 hover:text-mint ${i < items.length - 1 ? "border-secondary/20" : "border-transparent"}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-4">
                      <p className={`font-body text-body text-primary ${isActive ? "font-medium" : "font-normal"}`}>
                        {item.title}
                      </p>
                      {isActive && (
                        <p className="text-body-sm text-secondary">{item.description}</p>
                      )}
                    </div>
                    <svg
                      className={`mt-0.5 shrink-0 text-primary transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
                      width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Image
            src={active.image}
            alt={active.title}
            fill
            sizes="50vw"
            className="object-cover"
            priority={activeIndex === 0}
          />
        </div>
      </div>
    </div>
  );
}
