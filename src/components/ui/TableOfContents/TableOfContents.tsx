"use client";

import { useEffect, useRef, useState } from "react";
import type { TableOfContentsProps, TocItem } from "./TableOfContents.types";

function TocList({
  items,
  activeId,
  onItemClick,
}: {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li key={item.id} className="relative">
          <span
            className={`absolute left-0 top-0 h-6 w-[3px] rounded-full transition-colors duration-200 ${
              activeId === item.id ? "bg-mint" : "bg-transparent"
            }`}
          />
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              onItemClick(item.id);
            }}
            className={`flex gap-3 pl-4 text-body-sm transition-colors duration-200 ${
              activeId === item.id
                ? "font-medium text-primary"
                : "font-normal text-primary/60 hover:text-primary"
            }`}
          >
            <span className="shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="capitalize leading-snug">{item.title.toLowerCase()}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function TableOfContents({ items, label = "Table of Contents", className = "" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0% -80% 0%", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    setActiveId(id);
    isScrollingRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-8">
          <p className="mb-5 text-h4 font-normal uppercase tracking-[1.4px] text-primary/60">
            {label}
          </p>
          <TocList items={items} activeId={activeId} onItemClick={scrollToSection} />
        </div>
      </div>

      {/* Mobile: floating pill */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open table of contents"
        className="fixed bottom-6 left-4 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-body-sm font-normal uppercase leading-none text-white shadow-lg lg:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Table of Content
      </button>

      {/* Mobile: backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile: off-canvas drawer */}
      <div
        className={`fixed bottom-0 left-0 top-0 z-50 w-[320px] overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-h4 font-normal uppercase tracking-[1.4px] text-primary/60">
            {label}
          </p>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close table of contents"
            className="text-secondary hover:text-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <TocList items={items} activeId={activeId} onItemClick={scrollToSection} />
      </div>
    </>
  );
}
