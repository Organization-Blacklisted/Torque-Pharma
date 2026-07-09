"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems } from "@/data/nav.config";
import type { NavCategories } from "@/data/nav.config";
import type { DesktopNavProps } from "./DesktopNav.types";

function ChevronRight() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
      <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DesktopNav({ pathname, navCategories }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeMegaParent, setActiveMegaParent] = useState("domestic");
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
        // ── Mega menu (Products) ─────────────────────────────────────────────
        if (item.mega) {
          const getAreas = (slug: string) =>
            navCategories[slug as keyof NavCategories] ?? [];

          const isActive = item.mega.some((p) =>
            getAreas(p.slug).some((a) => pathname === a.href || pathname.startsWith(a.href + "/"))
          );
          const isOpen = openDropdown === item.label;
          const activeParent = item.mega.find((p) => p.slug === activeMegaParent) ?? item.mega[0];

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
                aria-expanded={isOpen}
                className={[
                  "font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200 outline-none",
                  isActive ? "text-primary font-medium" : "text-dark-blue hover:text-primary",
                ].join(" ")}
              >
                {item.label}
              </button>

              {/* Mega panel */}
              <div
                onMouseEnter={() => openNav(item.label)}
                onMouseLeave={scheduleClose}
                className={[
                  "absolute left-0 top-full mt-2 w-[680px] transition-all duration-150",
                  isOpen
                    ? "pointer-events-auto opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 -translate-y-1",
                ].join(" ")}
              >
                <div className="rounded-lg border border-black/[0.06] bg-white/90 backdrop-blur-[8px] shadow-sm p-6">
                  <div className="grid grid-cols-[200px_1px_1fr]">

                    {/* Left: parent tabs */}
                    <div className="flex flex-col gap-1 pr-6">
                      {item.mega.map((parent) => (
                        <button
                          key={parent.slug}
                          type="button"
                          onMouseEnter={() => setActiveMegaParent(parent.slug)}
                          className={[
                            "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-body text-body-sm transition-colors duration-150",
                            activeMegaParent === parent.slug
                              ? "bg-mint/10 text-primary font-medium"
                              : "text-secondary hover:bg-gray-50 font-normal",
                          ].join(" ")}
                        >
                          {parent.label}
                          <span className={activeMegaParent === parent.slug ? "text-primary" : "text-secondary/40"}>
                            <ChevronRight />
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="bg-black/10 my-4" />

                    {/* Right: therapeutic areas */}
                    <div className="pl-6">
                      <p className="mb-4 font-body text-button font-medium uppercase tracking-widest text-primary">
                        Therapeutic Areas
                      </p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-[18px]">
                        {getAreas(activeParent.slug).map((area) => (
                          <Link
                            key={area.href}
                            href={area.href}
                            aria-current={pathname === area.href ? "page" : undefined}
                            className={[
                              "font-body text-h5 font-normal leading-[26px] transition-colors duration-150",
                              pathname === area.href ? "text-primary font-medium" : "text-secondary hover:text-primary",
                            ].join(" ")}
                          >
                            {area.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        }

        // ── Regular dropdown ─────────────────────────────────────────────────
        if (item.children) {
          const isActive = item.children.some((c) => pathname === c.href);
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

        // ── Plain link ───────────────────────────────────────────────────────
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={[
              "font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200",
              pathname === item.href ? "text-primary font-medium" : "text-dark-blue hover:text-primary",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
