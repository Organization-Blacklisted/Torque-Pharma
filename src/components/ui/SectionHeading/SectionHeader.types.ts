import { ReactNode } from "react";

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowColor?: string;
  eyebrowDotColor?: string;
  title?: string;
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