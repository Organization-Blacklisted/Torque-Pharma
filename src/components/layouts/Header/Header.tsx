"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/layouts/Container/Container";

// ─── Data ────────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Company", href: "/company" },
  { label: "Global Presence", href: "/global-presence" },
  { label: "Products", href: "/products" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Life at Torque", href: "/life-at-torque" },
  { label: "Resources", href: "/resources" },
] as const;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ─── Header ──────────────────────────────────────────────────────────────────

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Hide/reveal header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 6) return;
      if (currentScrollY <= 10) {
        setHidden(false);
      } else if (delta > 0) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Move focus into / out of the drawer
  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [menuOpen]);

  // Focus trap + Escape key
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
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header
        className={[
          "fixed left-0 right-0 top-0 z-50 px-4 py-3 md:px-6 lg:px-subsection",
          hidden
            ? "duration-200 ease-in -translate-y-full transition-transform"
            : "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-0 transition-transform",
        ].join(" ")}
      >
        <div className="rounded-[8px] border border-white/30 bg-white/70 backdrop-blur-[2px]">
          <Container size="wide">
            <div className="flex h-[68px] items-center justify-between lg:h-[72px]">

              {/* Logo */}
              <Link href="/" className="shrink-0" aria-label="Torque Pharma — home">
                <Image
                  src="/torque-black.svg"
                  alt="Torque Pharma"
                  width={132}
                  height={38}
                  priority
                />
              </Link>

              {/* Desktop nav — visible nav+ */}
              <nav className="hidden nav:flex items-center gap-10" aria-label="Main navigation">
                {navItems.map(({ label, href }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={label}
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "font-body text-body-sm font-normal whitespace-nowrap transition-colors duration-200",
                        isActive
                          ? "text-primary font-medium"
                          : "text-dark-blue hover:text-primary",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop Contact CTA — hidden below nav breakpoint */}
              <Link
                href="/contact-us"
                aria-current={pathname === "/contact-us" ? "page" : undefined}
                className="hidden nav:flex shrink-0 items-center gap-2 font-body text-body-sm font-medium text-dark-blue uppercase"
              >
                Contact Us
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M13.8008 0.149414C13.9732 0.149439 14.1389 0.21796 14.2607 0.339844C14.3826 0.461728 14.4511 0.627436 14.4512 0.799805V10.7998C14.4512 10.9722 14.3826 11.1379 14.2607 11.2598C14.1389 11.3817 13.9732 11.4502 13.8008 11.4502C13.6284 11.4502 13.4627 11.3817 13.3408 11.2598C13.2189 11.1379 13.1504 10.9722 13.1504 10.7998V2.37012L1.26074 14.2598C1.00692 14.5135 0.594651 14.5135 0.34082 14.2598C0.0870451 14.0059 0.0870489 13.5937 0.34082 13.3398L12.2305 1.4502H3.80078C3.62841 1.4502 3.46271 1.38164 3.34082 1.25977C3.21892 1.13787 3.15039 0.972196 3.15039 0.799805C3.15039 0.627414 3.21892 0.461742 3.34082 0.339844C3.46271 0.217974 3.62841 0.149414 3.80078 0.149414H13.8008Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3"/>
                </svg>
              </Link>

              {/* Hamburger — visible below nav breakpoint */}
              <button
                ref={hamburgerRef}
                type="button"
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-drawer"
                onClick={() => setMenuOpen(true)}
                className="flex nav:hidden shrink-0 items-center justify-center p-1 outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="18" viewBox="0 0 30 18" fill="none" className="text-dark-blue" aria-hidden="true">
                  <line x1="0.75" y1="0.75" x2="29.25" y2="0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="0.75" y1="8.75" x2="29.25" y2="8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="0.75" y1="16.75" x2="29.25" y2="16.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

            </div>
          </Container>
        </div>
      </header>

      {/* Offcanvas backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={[
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Offcanvas drawer */}
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
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Image
            src="/torque-black.svg"
            alt="Torque Pharma"
            width={110}
            height={32}
          />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="p-1 text-dark-blue"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-6 py-6 flex-1" aria-label="Mobile navigation">
          {navItems.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMenu}
                className={[
                  "font-body text-body-sm py-3 border-b border-gray-100 last:border-0 transition-colors duration-200",
                  isActive
                    ? "text-primary font-medium"
                    : "text-dark-blue font-normal hover:text-primary",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Contact CTA at bottom of drawer */}
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
    </>
  );
}
