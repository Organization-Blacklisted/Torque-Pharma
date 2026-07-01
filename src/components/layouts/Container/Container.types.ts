import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "wide" | "xl" | "large" | "standard" | "content" | "narrow" | "reading";
}