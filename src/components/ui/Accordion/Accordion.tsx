"use client";

import { memo, useCallback, useState } from "react";
import { AccordionProps } from "./Accordion.types";
import { AccordionCloseIcon } from "./icons";

export default function Accordion({
  items,
  defaultOpenIndex = 0,
  className = "",
}: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultOpenIndex);

  const handleToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id ?? item.title ?? index}
          item={item}
          index={index}
          isOpen={activeIndex === index}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}

type AccordionItemProps = {
  item: { title: string; content: string };
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
};

const AccordionItem = memo(function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border-b border-yellowgray transition-colors duration-500">
      <button
        id={`accordion-trigger-${index}`}
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
        className="flex w-full items-center justify-between gap-8 py-5 text-left cursor-pointer"
      >
        <h3
          className={`text-body font-medium transition-colors duration-500 ${
            isOpen ? "text-primary" : "text-lightgray"
          }`}
        >
          {item.title}
        </h3>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-yellowgray">
          <span
            className={`transition-transform duration-500 ease-in-out ${
              isOpen ? "rotate-180 text-primary" : "rotate-0 text-dark-grey"
            }`}
          >
            <AccordionCloseIcon />
          </span>
        </span>
      </button>

      {/* CSS grid trick — no JS height measurement, resize-safe */}
      <div
        id={`accordion-content-${index}`}
        role="region"
        aria-labelledby={`accordion-trigger-${index}`}
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="max-w-5xl pb-6 text-body-sm text-secondary [&>p+p]:mt-6"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      </div>
    </div>
  );
});
