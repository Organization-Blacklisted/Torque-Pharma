import type { TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function FormTextarea({ hasError, className = "", ...props }: FormTextareaProps) {
  return (
    <textarea
      className={`w-full resize-none rounded-lg bg-surface px-4 py-3 text-body text-primary placeholder:text-secondary/60 outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
        hasError ? "ring-1 ring-red-500" : ""
      } ${className}`}
      {...props}
    />
  );
}
