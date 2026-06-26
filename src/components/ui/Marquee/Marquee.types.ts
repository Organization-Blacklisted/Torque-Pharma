export interface MarqueeProps {
  items: string[];
  separator?: string;
  /** Scroll duration in seconds — lower = faster. Default 30. */
  speed?: number;
  className?: string;
}
