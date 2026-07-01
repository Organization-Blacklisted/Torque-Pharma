import type { ReactNode } from "react";

interface FormFieldProps {
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ error, children, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
