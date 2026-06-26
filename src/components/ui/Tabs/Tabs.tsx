"use client";

import { useRef } from "react";
import type { TabListProps, TabProps } from "./Tabs.types";

export function TabList({ children, className = "" }: TabListProps) {
  return (
    <div
      role="tablist"
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
