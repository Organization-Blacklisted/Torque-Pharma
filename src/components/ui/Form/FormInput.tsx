import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function FormInput({ hasError, className = "", ...props }: FormInputProps) {
  return (
    <input
      className={`w-full min-h-[52px] rounded-lg bg-surface px-4 py-3 text-body text-primary placeholder:text-secondary/60 outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
        hasError ? "ring-1 ring-red-500" : ""
      } ${className}`}
      {...props}
    />
  );
}
