import type { Metadata } from "next";
import Container from "@/components/layouts/Container";
import { SplitButton } from "@/components/ui/SplitButton";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description:
    "This link may be broken or the page does not exist. Return home to explore Torque Pharma.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100svh-92px)] flex-col justify-center overflow-hidden py-[var(--spacing-section)] lg:min-h-[calc(100svh-96px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,white_0%,transparent_70%)]"
      />

      <Container size="large" className="relative">
        {/* Giant decorative numerals — aria-hidden so screen readers skip them */}
        <div className="flex items-center justify-center">
          <span
            aria-hidden="true"
            className="select-none font-heading font-medium leading-none text-primary/50 blur-[10px] text-[clamp(10rem,24vw,16rem)]"
          >
            404
          </span>
          <h1 className="absolute font-heading text-[32px] font-light leading-none text-primary">
            (Page Not Found)
          </h1>
        </div>

        <div className="mx-auto mt-10 flex w-full flex-col items-center text-center lg:ml-auto lg:mr-0 lg:max-w-[560px] lg:items-start lg:text-left">
          <p className="text-body text-secondary">
            This link may be broken or the page does not exist.
            <br />
            Return home to explore Torque Pharma.
          </p>

          <div className="mt-8">
            <SplitButton variant="primary" href="/">
              Back to Homepage
            </SplitButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
