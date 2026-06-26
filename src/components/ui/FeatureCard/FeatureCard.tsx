import Image from "next/image";
import type { FeatureCardProps } from "./FeatureCard.types";

export default function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div className={`flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-6 transition-colors duration-200 hover:border-mint ${className}`}>
      <div className="h-icon w-icon shrink-0">
        <Image src={icon} alt="" aria-hidden width={80} height={80} className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-h4 font-medium leading-snug text-white">{title}</h3>
        {description && (
          <p className="text-body leading-6 text-white/70">{description}</p>
        )}
      </div>
    </div>
  );
}
