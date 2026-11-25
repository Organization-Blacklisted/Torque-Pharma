import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible name for the dialog. Not rendered visually. */
  label: string;
  className?: string;
}
