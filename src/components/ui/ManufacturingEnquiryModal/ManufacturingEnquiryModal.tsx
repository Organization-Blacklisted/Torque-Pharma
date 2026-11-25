"use client";

import { createContext, useContext, useState } from "react";
import Modal from "@/components/ui/Modal";
import { SplitButton } from "@/components/ui/SplitButton";
import ThirdPartyManufacturingForm from "@/components/sections/third-party-manufacturing/TpmHeroFormSection/ThirdPartyManufacturingForm";
import type { EnquiryTriggerButtonProps, ManufacturingEnquiryProviderProps } from "./ManufacturingEnquiryModal.types";

const ManufacturingEnquiryContext = createContext<(() => void) | null>(null);

/**
 * Wrap a page's content in this to let any number of CTAs across unrelated
 * server-rendered sections (ContentMediaSection, WhyJoinSection, CtaSection,
 * etc.) open one shared enquiry modal, without threading an onClick callback
 * down from the page's async Server Component — the open/close state and
 * the Modal itself live here instead.
 */
export default function ManufacturingEnquiryProvider({
  pageName,
  pageUrl,
  children,
}: ManufacturingEnquiryProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ManufacturingEnquiryContext.Provider value={() => setIsOpen(true)}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        label="Manufacturing enquiry form"
        className="bg-dark-blue"
      >
        {/* [&>h2] reserves space for the Modal's absolutely-positioned close button so a
            wrapped two-line title never runs under it — scoped to this wrapper only, so
            ThirdPartyManufacturingForm's original (close-button-free) hero usage is untouched. */}
        <div className="p-5 sm:p-8 lg:p-10 [&>h2]:pr-12">
          <ThirdPartyManufacturingForm
            title="Let's Discuss Your Manufacturing Needs"
            subtitle="Tell us about your project."
            pageName={pageName}
            pageUrl={pageUrl}
            submitLabel="Request a Quote"
          />
        </div>
      </Modal>
    </ManufacturingEnquiryContext.Provider>
  );
}

/** Drop-in replacement for a CTA that used to link to /contact-us — opens the modal instead. */
export function EnquiryTriggerButton({ children, variant = "primary", className }: EnquiryTriggerButtonProps) {
  const openModal = useContext(ManufacturingEnquiryContext);

  if (!openModal) {
    throw new Error("EnquiryTriggerButton must be used within a ManufacturingEnquiryProvider");
  }

  return (
    <SplitButton type="button" onClick={openModal} variant={variant} className={className}>
      {children}
    </SplitButton>
  );
}
