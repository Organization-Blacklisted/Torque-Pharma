import { ReactNode } from "react";

export interface MediaContentCardProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}