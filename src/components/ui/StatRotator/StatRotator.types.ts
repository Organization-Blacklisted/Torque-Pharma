import { StatCardProps } from "../StatCard/StatCard.types";

export interface StatRotatorProps {
  // One array per card slot — each slot rotates through its own items independently
  slots: StatCardProps[][];

  interval?: number;

  className?: string;
}