import type { ProcessStepCardProps } from "./ProcessStepCard.types";

export default function ProcessStepCard({ step, title, description, className = "" }: ProcessStepCardProps) {
  const num = String(step).padStart(2, "0");

  return (
    <div className={`flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6 transition-colors duration-200 hover:border-mint ${className}`}>
      <p className="font-heading text-h4 text-mint">{num}.</p>
      <h3 className="mt-[var(--spacing-section-inner)] font-body text-body font-medium text-white">{title}</h3>
      <p className="mt-3 text-body-sm text-white/70">{description}</p>
    </div>
  );
}
