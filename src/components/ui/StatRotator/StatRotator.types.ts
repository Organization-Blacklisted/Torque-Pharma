import { StatCardProps } from "../StatCard/StatCard.types";

export interface StatRotatorProps {
  items: StatCardProps[];

  interval?: number;

  className?: string;
}