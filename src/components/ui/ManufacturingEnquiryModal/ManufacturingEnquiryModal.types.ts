import type { ReactNode } from "react";
import type { SplitButtonVariant } from "@/components/ui/SplitButton/variants";

export interface ManufacturingEnquiryProviderProps {
  pageName: string;
  pageUrl: string;
  children: ReactNode;
}

export interface EnquiryTriggerButtonProps {
  children: ReactNode;
  variant?: SplitButtonVariant;
  className?: string;
}
