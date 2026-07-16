import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function FormInput({ hasError, className = "", ...props }: FormInputProps) {
  // The design has no visible labels, so fall back to the placeholder as the
  // accessible name. This gives screen readers a real field name (WCAG 1.3.1 /
  // 3.3.2 / 4.1.2) with zero visual change — nothing is rendered on screen.
  const ariaLabel =
    props["aria-label"] ??
    (typeof props.placeholder === "string" ? props.placeholder : undefined);

  return (
    <input
      className={`w-full min-h-[52px] rounded-lg bg-surface px-4 py-3 text-body text-primary placeholder:text-secondary/60 outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
        hasError ? "ring-1 ring-red-500" : ""
      } ${className}`}
      {...props}
      aria-label={ariaLabel}
      aria-invalid={hasError || undefined}
    />
  );
}
