import type { SplitButtonVariant } from "@/components/ui/SplitButton";
import type { ReactNode } from "react";

export interface CtaSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  variant?: "gradient" | "glass";
  button?: {
    label: string;
    href: string;
    variant?: SplitButtonVariant;
  };
  children?: ReactNode;
  className?: string;
}
