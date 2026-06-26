export interface StatCardProps {
  label?: string;
  value: string;
  suffix?: string;
  description: string;
  theme?: "light" | "dark";
  className?: string;

showDots?: boolean;
isFirstDotActive?: boolean;
}