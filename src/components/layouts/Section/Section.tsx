import { SectionProps } from "./Section.types";

export default function Section({
  children,
  spacing = "default",
  first = false,
  padded = false,
  className = "",
  as = "section",
}: SectionProps) {
  const Component = as;

  const spacingClasses = {
    default: first
      ? "mt-[var(--spacing-page-top)] mb-[var(--spacing-section)]"
      : "my-[var(--spacing-section)]",
    none: "",
  };

  return (
    <Component
      className={`
        ${spacingClasses[spacing]}
        ${
          padded
            ? "py-[var(--spacing-section-inner)]"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </Component>
  );
}