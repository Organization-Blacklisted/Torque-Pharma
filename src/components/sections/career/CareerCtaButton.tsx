"use client";

import { SplitButton } from "@/components/ui/SplitButton";

export default function CareerCtaButton({ label }: { label: string }) {
  return (
    <SplitButton
      variant="secondary"
      onClick={() => document.getElementById("roles-opening")?.scrollIntoView({ behavior: "smooth" })}
    >
      {label}
    </SplitButton>
  );
}
