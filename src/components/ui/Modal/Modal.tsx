"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ModalProps } from "./Modal.types";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const TRANSITION_MS = 200;

export default function Modal({ isOpen, onClose, children, label, className = "" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Stays mounted TRANSITION_MS after isOpen goes false, so the exit
  // transition (driven by `visible`, below) has time to actually play
  // before the portal unmounts — otherwise closing would just vanish instantly.
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Mounting already-open would apply the "open" classes on the very first
  // paint, giving CSS nothing to transition FROM — so this starts false even
  // when shouldRender flips true, and only flips true a frame later via rAF,
  // letting the browser paint the closed state first and then animate in.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Mount in the closed state first (queueMicrotask runs before the next
      // paint), then flip to visible on the following animation frame — two
      // separate paints are what let the CSS transition actually animate,
      // instead of mounting straight into its final "open" classes.
      queueMicrotask(() => setShouldRender(true));
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    queueMicrotask(() => setVisible(false));
    const timer = setTimeout(() => setShouldRender(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  useEffect(() => {
    // Keyed on shouldRender, not isOpen — on the render where isOpen first
    // flips true, shouldRender (and so the close button itself) hasn't
    // mounted yet, so focusing here would silently hit a null ref.
    if (shouldRender) closeButtonRef.current?.focus();
  }, [shouldRender]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-lg shadow-2xl transition-opacity duration-200 ease-out lg:max-w-[720px] ${
          visible ? "opacity-100" : "opacity-0"
        } ${className}`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
