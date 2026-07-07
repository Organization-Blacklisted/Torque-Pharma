import { ReactNode } from "react";

export interface StatsMediaSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  headingClassName?: string;
  className?: string;
}