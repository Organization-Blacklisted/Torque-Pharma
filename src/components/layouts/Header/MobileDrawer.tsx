"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/data/nav.config";
import type { MobileDrawerProps } from "./MobileDrawer.types";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ChevronDown({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true"
      className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileDrawer({ menuOpen, closeMenu, pathname }: MobileDrawerProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [openSubAccordion, setOpenSubAccordion] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
    } else {
      setOpenAccordion(null);
      setOpenSubAccordion(null);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <div
      id="mobile-nav-drawer"
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className={[
        "fixed right-0 top-0 z-[70] flex h-full w-[300px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        menuOpen ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <Image src="/torque-black.svg" alt="Torque Pharma" width={110} height={32} />
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="p-1 text-dark-blue"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <nav className="flex flex-col flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile navigation">
        {navItems.map((item) => {
          // ── Mega menu (Products) ───────────────────────────────────────────
          if (item.mega) {
            const isOpen = openAccordion === item.label;
            const isActive = item.mega.some((p) =>
              p.areas.some((a) => pathname === a.href || pathname.startsWith(a.href + "/"))
            );

            return (
              <div key={item.label} className="border-b border-gray-100 last:border-0">
                <button
                  type="button"
                  onClick={() => {
                    const next = isOpen ? null : item.label;
                    setOpenAccordion(next);
                    if (!next) setOpenSubAccordion(null);
                  }}
                  className={[
                    "flex w-full items-center justify-between py-3 font-body text-body-sm transition-colors duration-200",
                    isActive ? "text-primary font-medium" : "text-dark-blue font-normal",
                  ].join(" ")}
                >
                  {item.label}
                  <ChevronDown isOpen={isOpen} />
                </button>

                {isOpen && (
                  <div className="flex flex-col pb-3 pl-3">
                    {item.mega.map((parent) => {
                      const isSubOpen = openSubAccordion === parent.slug;
                      const isSubActive = parent.areas.some(
                        (a) => pathname === a.href || pathname.startsWith(a.href + "/")
                      );

                      return (
                        <div key={parent.slug}>
                          <button
                            type="button"
                            onClick={() => setOpenSubAccordion(isSubOpen ? null : parent.slug)}
                            className={[
                              "flex w-full items-center justify-between py-2.5 font-body text-body-sm transition-colors duration-200",
                              isSubActive ? "text-primary font-medium" : "text-secondary font-normal",
                            ].join(" ")}
                          >
                            {parent.label}
                            <ChevronDown isOpen={isSubOpen} />
                          </button>

                          {isSubOpen && (
                            <div className="flex flex-col pb-2 pl-3">
                              {parent.areas.map((area) => (
                                <Link
                                  key={area.href}
                                  href={area.href}
                                  onClick={closeMenu}
                                  aria-current={pathname === area.href ? "page" : undefined}
                                  className={[
                                    "flex items-center gap-2 py-2 font-body text-body-sm transition-colors duration-200",
                                    pathname === area.href
                                      ? "text-primary font-medium"
                                      : "text-secondary/70 hover:text-primary",
                                  ].join(" ")}
                                >
                                  <span className="text-secondary/30"><ChevronRight /></span>
                                  {area.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // ── Regular dropdown ───────────────────────────────────────────────
          if (item.children) {
            const isOpen = openAccordion === item.label;
            const isActive = item.children.some((c) => pathname === c.href);

            return (
              <div key={item.label} className="border-b border-gray-100 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(isOpen ? null : item.label)}
                  className={[
                    "flex w-full items-center justify-between py-3 font-body text-body-sm transition-colors duration-200",
                    isActive ? "text-primary font-medium" : "text-dark-blue font-normal",
                  ].join(" ")}
                >
                  {item.label}
                  <ChevronDown isOpen={isOpen} />
                </button>

                {isOpen && (
                  <div className="flex flex-col pb-3 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                        aria-current={pathname === child.href ? "page" : undefined}
                        className={[
                          "py-2 font-body text-body-sm transition-colors duration-200",
                          pathname === child.href ? "text-primary font-medium" : "text-secondary hover:text-primary",
                        ].join(" ")}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // ── Plain link ─────────────────────────────────────────────────────
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={closeMenu}
              className={[
                "border-b border-gray-100 last:border-0 py-3 font-body text-body-sm transition-colors duration-200",
                pathname === item.href ? "text-primary font-medium" : "text-dark-blue font-normal hover:text-primary",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-gray-100">
        <Link
          href="/contact-us"
          aria-current={pathname === "/contact-us" ? "page" : undefined}
          onClick={closeMenu}
          className="flex items-center gap-2 font-body text-body-sm font-medium text-dark-blue uppercase"
        >
          Contact Us
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
