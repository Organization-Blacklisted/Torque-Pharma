"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="font-body text-body-sm text-secondary">
        Failed to load Disclaimer.
      </p>
      <button
        type="button"
        onClick={reset}
        className="font-body text-body-sm text-primary underline"
      >
        Try again
      </button>
    </div>
  );
}
