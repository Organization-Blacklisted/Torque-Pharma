import Image from "next/image";
import type { FeatureCardProps } from "./FeatureCard.types";

export default function FeatureCard({
  icon,
  title,
  description,
  variant = "dark",
  className = "",
}: FeatureCardProps) {
  const isDark = variant === "dark";
  return (
    <div
      className={`flex flex-col gap-4 rounded-lg border p-6 transition-colors duration-200 ${
        isDark
          ? "border-white/10 bg-white/5 hover:border-mint"
          : "border-black/10 bg-transparent hover:border-mint"
      } ${className}`}
    >
      <div className="h-icon w-icon shrink-0">
        <Image src={icon} alt="" aria-hidden width={80} height={80} className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className={`text-[20px] font-medium leading-6 ${isDark ? "text-white" : "text-primary"}`}>{title}</h3>
        {description && (
          <p className={`text-[20px] leading-6 ${isDark ? "text-white/70" : "text-secondary"}`}>{description}</p>
        )}
      </div>
    </div>
  );
}
