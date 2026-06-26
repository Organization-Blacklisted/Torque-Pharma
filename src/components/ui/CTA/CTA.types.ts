import { ReactNode } from "react";

export interface CTAProps {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: "glass" | "gradient";
  children?: ReactNode;
  className?: string;
}