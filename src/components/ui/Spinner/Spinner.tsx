import type { SpinnerProps } from "./Spinner.types";

// Extracted from the original inline markup in src/app/loading.tsx (root
// route loading state) so the same mint spinner can be reused anywhere
// else on the site — pass a size (e.g. "h-6 w-6") via className to
// override the default h-10 w-10.
export default function Spinner({ className = "h-10 w-10" }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-mint border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
