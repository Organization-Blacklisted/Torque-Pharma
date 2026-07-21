import type { ReactNode } from "react";

export interface MobileSliderProps {
  /** The grid items (cards, stats, etc.). Each becomes one slide on mobile. */
  children: ReactNode;
  /**
   * The section's normal responsive grid classes, e.g.
   * "grid grid-cols-1 gap-[var(--spacing-gutter)] sm:grid-cols-2 md:grid-cols-4".
   * These apply unchanged at >=450px; below 450px they are overridden by the
   * horizontal scroll-snap slider.
   */
  desktopClassName?: string;
  /** Px of the next card left peeking on mobile (default 24). */
  peek?: number;
  /** Px gap between cards on mobile (default 16). */
  gap?: number;
  /** Optional class on the outer wrapper. */
  className?: string;
  /**
   * Optional classes applied to each slide cell — use for non-grid desktop
   * layouts (e.g. flex-wrap with per-item widths). Ignored below 450px, where
   * the slider sizing takes over.
   */
  cellClassName?: string;
  /** Accessible label for the carousel region (default "Carousel"). */
  ariaLabel?: string;
}
