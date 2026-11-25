import type { ReactNode } from "react";

export interface ExmQualityChecklistSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  items: { text: string }[];
  button?: { label: string; href: string };
  /** Renders in place of the CMS-driven `button` when provided. */
  buttonOverride?: ReactNode;
  className?: string;
}
