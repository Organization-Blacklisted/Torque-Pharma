export interface QualityAssessmentSectionProps {
  eyebrow: string;
  title: string;
  items: { image: string; title: string; description: string }[];
  className?: string;
}
