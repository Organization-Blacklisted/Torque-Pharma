export type ResponsiveCount =
  | number
  | { default: number; sm?: number; md?: number; lg?: number; xl?: number };

export interface SliderProps {
  children: React.ReactNode;
  visibleCount?: ResponsiveCount;
  className?: string;
  /** Remove overflow-hidden from the embla viewport so a parent element can control clipping */
  overflowVisible?: boolean;
  /** Hide progress bar and Showing X/Y counter — only arrows rendered */
  showProgress?: boolean;
  /** Horizontal alignment of the controls row */
  controlsAlign?: "start" | "center" | "end";
  /** Show a partial peek of the next slide (default true). Pass false for clean full-width N-per-view */
  peek?: boolean;
  /** Continuously auto-scroll in a seamless loop with no arrows/progress bar/drag — for a passive marquee-style display rather than a user-controlled carousel */
  autoScroll?: boolean;
}
