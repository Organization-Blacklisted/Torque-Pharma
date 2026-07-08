export interface QualityAssessmentSectionProps {
  eyebrow?: string;
  title: string;
  items: { image: string; title: string; subtitle?: string; description: string }[];
  containerSize?: "wide" | "large" | "standard" | "content" | "reading";
  className?: string;
}
