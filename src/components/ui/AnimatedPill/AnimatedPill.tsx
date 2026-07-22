import type { AnimatedPillProps } from "./AnimatedPill.types";

export default function AnimatedPill({ children, className = "" }: AnimatedPillProps) {
  return (
    <div className={`pill-outer ${className}`}>
      <div className="pill-track" aria-hidden="true" />
      <div className="pill-inner p-5 sm:px-8 sm:py-10 md:px-16 lg:px-[9rem]">
        {children}
      </div>
    </div>
  );
}
