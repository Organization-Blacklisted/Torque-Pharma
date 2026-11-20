"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems } from "@/data/nav.config";
import type { DesktopNavProps } from "./DesktopNav.types";

function ChevronRight() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
      <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"
      // Geometrically centered against the label reads as sitting too high —
      // a downward-pointing chevron's visual weight is at its bottom tip, so
      // it needs a slight downward nudge to look optically centered.
      className={`shrink-0 translate-y-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DesktopNav({ pathname }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  // The sub-flyout always opens to the right (never flips side) — it just
  // fills whatever space is actually left before the viewport edge, only
  // wrapping its longest label onto a second line once that space runs out.
  const [subMenuMaxWidth, setSubMenuMaxWidth] = useState<number>(380);
  const [activeMegaParent, setActiveMegaParent] = useState("domestic");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpenDropdown(null);
    setOpenSubDropdown(null);
  }, [pathname]);

  const openNav = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const SUB_MENU_GAP = 8; // matches ml-2
  const SUB_MENU_EDGE_MARGIN = 16; // breathing room before the viewport edge
  const SUB_MENU_PREFERRED_WIDTH = 380; // comfortable single-line width for the longest label
  const SUB_MENU_MIN_WIDTH = 180;

  const computeMaxWidth = (wrapperEl: Element | null) => {
    if (!wrapperEl) return SUB_MENU_PREFERRED_WIDTH;
    const rect = wrapperEl.getBoundingClientRect();
    const available = window.innerWidth - rect.right - SUB_MENU_GAP - SUB_MENU_EDGE_MARGIN;
    return Math.max(SUB_MENU_MIN_WIDTH, Math.min(SUB_MENU_PREFERRED_WIDTH, available));
  };

  const openSubNav = (label: string, wrapperEl?: Element | null) => {
    if (subCloseTimerRef.current) clearTimeout(subCloseTimerRef.current);
    if (wrapperEl) setSubMenuMaxWidth(computeMaxWidth(wrapperEl));
    setOpenSubDropdown(label);
  };

  const toggleSubNav = (label: string, wrapperEl: Element | null) => {
    if (subCloseTimerRef.current) clearTimeout(subCloseTimerRef.current);
    setOpenSubDropdown((prev) => {
      if (prev === label) return null;
      if (wrapperEl) setSubMenuMaxWidth(computeMaxWidth(wrapperEl));
      return label;
    });
  };

  const scheduleSubClose = () => {
    subCloseTimerRef.current = setTimeout(() => setOpenSubDropdown(null), 150);
  };

  return (
    <nav className="hidden nav:flex items-center gap-10 self-stretch" aria-label="Main navigation">
      {navItems.map((item) => {
        // ── Mega menu (Products) ─────────────────────────────────────────────
        if (item.mega) {
          const isActive = item.mega.some((p) =>
            p.areas.some((a) => pathname === a.href || pathname.startsWith(a.href + "/"))
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
                  "flex items-center gap-1.5 font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200 outline-none",
                  isActive ? "text-primary font-medium" : "text-dark-blue hover:text-primary",
                ].join(" ")}
              >
                {item.label}
                <ChevronDown isOpen={isOpen} />
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
                        {activeParent.areas.map((area) => (
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
                  "flex items-center gap-1.5 font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200 outline-none",
                  isActive ? "text-primary font-medium" : "text-dark-blue hover:text-primary",
                ].join(" ")}
              >
                {item.label}
                <ChevronDown isOpen={openDropdown === item.label} />
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
                  {item.children.map((child) =>
                    child.children ? (
                      <div
                        key={child.label}
                        className="relative"
                        onMouseEnter={(e) => openSubNav(child.label, e.currentTarget)}
                        onMouseLeave={scheduleSubClose}
                      >
                        <div className="flex w-full items-center gap-6">
                          <Link
                            href={child.href}
                            className="flex-1 font-body text-h5 font-normal leading-6 text-secondary hover:text-primary transition-colors duration-200"
                          >
                            {child.label}
                          </Link>
                          <button
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={openSubDropdown === child.label}
                            aria-label={`Toggle ${child.label} submenu`}
                            onClick={(e) => {
                              // Toggling the submenu is this button's only job — it must
                              // never navigate, so the label link above stays the sole
                              // click target for going to the page itself.
                              e.preventDefault();
                              toggleSubNav(child.label, e.currentTarget.closest(".relative"));
                            }}
                            className="shrink-0 p-1 text-secondary hover:text-primary transition-colors duration-200"
                          >
                            <ChevronRight />
                          </button>
                        </div>

                        <div
                          onMouseEnter={(e) => openSubNav(child.label, e.currentTarget.parentElement)}
                          onMouseLeave={scheduleSubClose}
                          className={[
                            "absolute left-full top-0 ml-2 transition-all duration-150",
                            openSubDropdown === child.label
                              ? "pointer-events-auto opacity-100 translate-x-0"
                              : "pointer-events-none opacity-0 -translate-x-1",
                          ].join(" ")}
                        >
                          {/* Always opens to the right, never flips side. Explicit pixel
                              `width` (not max-width on an intrinsically-sized box) so
                              every browser wraps the text identically — fills as much
                              space as is actually left before the viewport edge, up to
                              a comfortable 380px, and a long label like "Export
                              Manufacturing (Pharma & Ayurveda)" only wraps onto a
                              second line once that space runs out. */}
                          <div
                            data-submenu-panel
                            style={{ width: subMenuMaxWidth }}
                            className="rounded-lg border border-black/[0.06] bg-white/90 backdrop-blur-[8px] p-6 shadow-sm flex flex-col gap-4"
                          >
                            {child.children.map((grandchild) => (
                              <Link
                                key={grandchild.href}
                                href={grandchild.href}
                                className="block font-body text-h5 font-normal leading-6 text-secondary hover:text-primary transition-colors duration-200"
                                style={{ whiteSpace: "normal", wordBreak: "normal" }}
                              >
                                {grandchild.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="font-body text-h5 font-normal leading-6 text-secondary hover:text-primary transition-colors duration-200"
                      >
                        {child.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        }

        // ── External link — opens in a new tab, never "active" ───────────────
        if (item.external) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-body-sm font-normal whitespace-nowrap text-dark-blue transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </a>
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
