import { ElementType, ReactNode } from "react";

export interface SectionProps {
  children: ReactNode;
  spacing?: "default" | "none";
  first?: boolean;
  padded?: boolean;
  className?: string;
  as?: ElementType;
}