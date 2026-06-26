"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

const sanitize = (html: string) =>
  typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;

import { AccordionProps } from "./Accordion.types";
import { AccordionCloseIcon } from "./icons";

export default function Accordion({
  items,
  defaultOpenIndex = 0,
  className = "",
}: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(
    defaultOpenIndex
  );

  const handleToggle = (index: number) => {
    setActiveIndex((prev) =>
      prev === index ? -1 : index
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id ?? item.title ?? index}
          item={item}
          index={index}
          isOpen={activeIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

type AccordionItemProps = {
  item: {
    title: string;
    content: string;
  };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, item.content]);

  return (
    <div
      className="
        border-b
        border-yellowgray
        transition-colors
        duration-500
      "
    >
      <button
        id={`accordion-trigger-${index}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${index}`}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-8
          py-5
          text-left
          cursor-pointer
        "
      >
        <h3
          className={`
            text-h4
            font-medium
            transition-colors
            duration-500
            ${
              isOpen
                ? "text-primary"
                : "text-lightgray"
            }
          `}
        >
          {item.title}
        </h3>

        <span
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-md
            border
            border-yellowgray
          "
        >
          <span
            className={`
              transition-transform
              duration-500
              ease-in-out
              ${
                isOpen
                  ? "rotate-180 text-primary"
                  : "rotate-0 text-dark-grey"
              }
            `}
          >
            <AccordionCloseIcon />
          </span>
        </span>
      </button>

      <div
        id={`accordion-content-${index}`}
        role="region"
        aria-labelledby={`accordion-trigger-${index}`}
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
        }}
        className="
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
        "
      >
        <div
          ref={contentRef}
          className="
            max-w-5xl
            pb-6
            text-body-sm
            
            text-secondary
            [&>p+p]:mt-6
          "
          dangerouslySetInnerHTML={{
            __html: sanitize(item.content),
          }}
        />
      </div>
    </div>
  );
}