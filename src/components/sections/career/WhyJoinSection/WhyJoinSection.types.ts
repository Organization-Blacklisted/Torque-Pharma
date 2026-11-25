import type { ReactNode } from "react";

export interface WhyJoinItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyJoinSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: WhyJoinItem[];
  /** Rendered as a centered button below the slider. */
  button?: { label: string; href: string };
  /** Renders in place of the CMS-driven `button` when provided — e.g. a button that
   * opens a modal instead of navigating. The CMS `button` label/href data is otherwise unused. */
  buttonOverride?: ReactNode;
  className?: string;
}
