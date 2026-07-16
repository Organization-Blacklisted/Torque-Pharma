import type { TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function FormTextarea({ hasError, className = "", ...props }: FormTextareaProps) {
  // The design has no visible labels, so fall back to the placeholder as the
  // accessible name — screen-reader label only, no visual change.
  const ariaLabel =
    props["aria-label"] ??
    (typeof props.placeholder === "string" ? props.placeholder : undefined);

  return (
    <textarea
      className={`w-full resize-none rounded-lg bg-surface px-4 py-3 text-body text-primary placeholder:text-secondary/60 outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
        hasError ? "ring-1 ring-red-500" : ""
      } ${className}`}
      {...props}
      aria-label={ariaLabel}
      aria-invalid={hasError || undefined}
    />
  );
}
