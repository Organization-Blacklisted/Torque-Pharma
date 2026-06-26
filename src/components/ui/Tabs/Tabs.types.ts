import type { ReactNode } from "react";

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export interface TabProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  id?: string;
  panelId?: string;
  className?: string;
}
