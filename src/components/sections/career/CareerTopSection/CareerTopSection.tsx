"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import type { CareerTopSectionProps } from "./CareerTopSection.types";

export default function CareerTopSection({
  eyebrow,
  heading,
  description,
  buttonText,
  buttonLink,
  items,
  className = "",
}: CareerTopSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${className}`}>
      {/* Left: text content */}
      <div className="flex flex-col gap-8">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          description={description}
          as="h1"
          size="h1"
        />
        <div>
          <SplitButton variant="primary" href={buttonLink}>
            {buttonText}
          </SplitButton>
        </div>
      </div>

      {/* Right: animated accordion cards */}
      <div className="flex h-[400px] gap-6 lg:h-[609px]">
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.title}
              type="button"
              aria-label={`View ${item.title}`}
              onClick={() => setActiveIndex(i)}
              className={`relative overflow-hidden rounded-xl transition-[flex] duration-500 ease-in-out ${
                isActive ? "flex-[4] cursor-default" : "flex-[1] cursor-pointer"
              }`}
            >
              {/* Background image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 80vw, 50vw"
                className="object-cover"
                priority={i === 0}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Title: fixed anchor at bottom, centers horizontally when inactive */}
              <div
                className="absolute transition-[left] duration-500 ease-in-out"
                style={{ bottom: "30px", left: isActive ? "30px" : "calc(50% + 12px)" }}
              >
                <p
                  className="whitespace-nowrap text-body font-medium leading-6 text-white transition-transform duration-500 ease-in-out"
                  style={{
                    transform: isActive ? "rotate(0deg)" : "rotate(-90deg)",
                    transformOrigin: "left bottom",
                  }}
                >
                  {item.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
