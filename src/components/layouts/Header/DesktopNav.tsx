"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems } from "@/data/nav.config";
import type { DesktopNavProps } from "./DesktopNav.types";

export default function DesktopNav({ pathname }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const openNav = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <nav className="hidden nav:flex items-center gap-10 self-stretch" aria-label="Main navigation">
      {navItems.map((item) => {
        const hasChildren = !!item.children;
        const isActive = hasChildren
          ? item.children.some((c) => pathname === c.href)
          : pathname === item.href;

        if (hasChildren) {
          return (
            <div
              key={item.label}
              className="relative self-stretch flex items-center"
              onMouseEnter={() => openNav(item.label)}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === item.label}
                className={[
                  "font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200 outline-none",
                  isActive ? "text-primary font-medium" : "text-dark-blue hover:text-primary",
                ].join(" ")}
              >
                {item.label}
              </button>

              <div
                onMouseEnter={() => openNav(item.label)}
                onMouseLeave={scheduleClose}
                className={[
                  "absolute left-0 top-full mt-2 transition-all duration-150",
                  openDropdown === item.label
                    ? "pointer-events-auto opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 -translate-y-1",
                ].join(" ")}
              >
                <div className="w-max min-w-[180px] rounded-lg border border-black/[0.06] bg-white/90 backdrop-blur-[8px] p-6 shadow-sm flex flex-col gap-4 whitespace-nowrap">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="font-body text-h5 font-normal leading-6 text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200",
              isActive ? "text-primary font-medium" : "text-dark-blue hover:text-primary",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
