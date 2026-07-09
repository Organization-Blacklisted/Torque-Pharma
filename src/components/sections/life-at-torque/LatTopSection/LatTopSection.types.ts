import type { LatTopData } from "@/lib/api/life-at-torque";

export interface LatTopSectionProps extends Omit<LatTopData, "shortDescription"> {
  className?: string;
}
