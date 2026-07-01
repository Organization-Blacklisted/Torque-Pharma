"use client";

import { useRef } from "react";
import type { TabListProps, TabProps } from "./Tabs.types";

export function TabList({ children, className = "" }: TabListProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }
  };

  return (
    <div
      role="tablist"
      onKeyDown={handleKeyDown}
      className={`flex overflow-x-auto border-b border-black/20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function Tab({ children, isActive, onClick, id, panelId, className = "" }: TabProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (ref.current) {
      const tab = ref.current;
      const list = tab.parentElement;
      if (list) {
        const scrollTo = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
        list.scrollTo({ left: Math.max(0, scrollTo), behavior: "smooth" });
      }
    }
    onClick();
  };

  return (
    <button
      ref={ref}
      role="tab"
      id={id}
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-controls={panelId}
      onClick={handleClick}
      className={`
        -mb-px shrink-0 cursor-pointer border-b-[3px] pb-3 pt-1
        text-h5 font-medium uppercase
        transition-colors duration-200
        ${isActive
          ? "border-mint text-primary"
          : "border-transparent text-primary/60 hover:text-primary"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
