import { ReactNode } from "react";

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowColor?: string;
  eyebrowDotColor?: string;
  title?: string;
  /** Render `title` as sanitized HTML (e.g. a CMS-inserted <br>) instead of plain text. Caller must pre-sanitize. */
  titleHtml?: boolean;
  description?: string;
  content?: string;
  children?: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  variant?: "default" | "split";
}