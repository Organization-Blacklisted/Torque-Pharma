"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeading";
import { TabList, Tab } from "@/components/ui/Tabs";
import ManufacturingForm from "./ManufacturingForm";
import WhiteLabelForm from "./WhiteLabelForm";
import ExportForm from "./ExportForm";
import type { EnquirySupportSectionProps } from "./EnquirySupportSection.types";

const TABS = ["Manufacturing", "White Label", "Export"] as const;

export default function EnquirySupportSection({
  eyebrow,
  heading,
  description,
  className = "",
}: EnquirySupportSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={`grid lg:grid-cols-12 lg:justify-between items-start gap-y-10 ${className}`}>
      {/* Left — section info */}
      <div className="lg:col-span-5 max-w-[600px]">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          description={description}
        />
      </div>

      {/* Right — tabs + form */}
      <div className="lg:col-span-6 lg:col-start-7">
        <h3 className="font-heading text-h3 font-light text-primary mb-6">
          Fill Out The Form
        </h3>

        <TabList className="mb-8">
          {TABS.map((tab, i) => (
            <Tab
              key={tab}
              isActive={activeTab === i}
              onClick={() => setActiveTab(i)}
              id={`enquiry-tab-${i}`}
              panelId={`enquiry-panel-${i}`}
              className="mr-[var(--spacing-subsection)] last:mr-0"
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <div
          role="tabpanel"
          id={`enquiry-panel-${activeTab}`}
          aria-labelledby={`enquiry-tab-${activeTab}`}
        >
          {activeTab === 0 && <ManufacturingForm />}
          {activeTab === 1 && <WhiteLabelForm />}
          {activeTab === 2 && <ExportForm />}
        </div>
      </div>
    </div>
  );
}
