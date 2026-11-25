"use client";

import { SplitButton } from "@/components/ui/SplitButton";
import type { SplitButtonVariant } from "@/components/ui/SplitButton/variants";

/**
 * Replaces a plain `href="#tpm-enquiry-form"` Link — Next's Link duplicates
 * the hash instead of replacing it when the URL already ends in that same
 * hash (clicking twice gives "#tpm-enquiry-form#tpm-enquiry-form"), and the
 * jump isn't reliably smooth. This scrolls directly instead, touching no URL.
 */
export default function ScrollToFormButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: SplitButtonVariant;
}) {
  return (
    <SplitButton
      type="button"
      variant={variant}
      onClick={() => document.getElementById("tpm-enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" })}
    >
      {children}
    </SplitButton>
  );
}
