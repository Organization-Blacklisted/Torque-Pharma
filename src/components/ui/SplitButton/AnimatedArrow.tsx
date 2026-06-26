import { ArrowIcon } from "./ArrowIcon";
import "./split-button.css";

type AnimatedArrowProps = {
  className?: string;
};

export function AnimatedArrow({ className }: AnimatedArrowProps) {
  const arrowClass = `h-4 w-4 shrink-0 ${className ?? ""}`;

  return (
    <span className="split-btn-arrow">
      <span className="split-btn-arrow-track split-btn-arrow-exit">
        <ArrowIcon className={arrowClass} />
      </span>
      <span className="split-btn-arrow-track split-btn-arrow-enter">
        <ArrowIcon className={arrowClass} />
      </span>
    </span>
  );
}
