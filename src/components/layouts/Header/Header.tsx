"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/layouts/Container/Container";
import DesktopNav from "./DesktopNav";
import MobileDrawer from "./MobileDrawer";
import type { NavCategories } from "@/data/nav.config";

export default function Header({ navCategories }: { navCategories: NavCategories }) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Hide/reveal on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 6) return;
      if (currentScrollY <= 10) setHidden(false);
      else if (delta > 0) setHidden(true);
      else setHidden(false);
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

  // Return focus to hamburger when drawer closes
  useEffect(() => {
    if (!menuOpen) hamburgerRef.current?.focus();
  }, [menuOpen]);

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

              <Link href="/" className="shrink-0" aria-label="Torque Pharma — home">
                <Image src="/torque-black.svg" alt="Torque Pharma" width={132} height={38} priority />
              </Link>

              <DesktopNav pathname={pathname} navCategories={navCategories} />

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

      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={[
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      <MobileDrawer menuOpen={menuOpen} closeMenu={closeMenu} pathname={pathname} navCategories={navCategories} />
    </>
  );
}
