"use client";

import Container from "@/components/layouts/Container";
import { SplitButton } from "@/components/ui/SplitButton";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] items-center py-[var(--spacing-section)]">
      <Container size="content">
        <div className="flex flex-col items-center gap-8 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="0.75" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-h2 font-light leading-[1.1] text-primary">
              Something went wrong
            </h1>
            <p className="text-body text-secondary">
              We ran into an issue loading this page. This is usually
              temporary — please try again or return to the homepage.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <SplitButton variant="primary" onClick={reset}>
              Try again
            </SplitButton>
            <SplitButton variant="outline-dark" href="/">
              Go to homepage
            </SplitButton>
          </div>

        </div>
      </Container>
    </section>
  );
}
