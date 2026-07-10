export interface FeatureCardProps {
  icon: string;
  title: string;
  description?: string;
  variant?: "dark" | "light";
  highlighted?: boolean;
  className?: string;
}
