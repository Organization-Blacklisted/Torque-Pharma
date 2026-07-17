import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import SafeHtml from "@/components/ui/SafeHtml";
import type { ContactInfoSectionProps, ContactInfoItem } from "./ContactInfoSection.types";

function ContactCard({ item }: { item: ContactInfoItem }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(item.text);

  return (
    <div className="rounded-lg border border-[#C6CCD8] bg-mint/[0.07] p-8">
      <div className="mb-4 h-10 w-10 relative">
        <Image src={item.image} alt="" fill className="object-contain" />
      </div>
      {isHtml ? (
        <SafeHtml
          html={item.text}
          className="font-body text-h5 font-medium text-primary [&_a]:text-primary [&_a]:no-underline mb-4"
        />
      ) : (
        <p className="font-body text-h5 font-medium text-primary mb-4">{item.text}</p>
      )}
      <p className="font-body text-h5 font-normal text-secondary/70">{item.description}</p>
    </div>
  );
}

export default function ContactInfoSection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: ContactInfoSectionProps) {
  return (
    <div className={className}>
      {/* This section is the contact page's hero — heading must be the page h1 */}
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        description={description}
        variant="split"
        as="h1"
        className="mb-10"
        headingClassName="max-w-[500px]"
      />
      <div className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr]">
        {items.map((item) => (
          <ContactCard key={item.image} item={item} />
        ))}
      </div>
    </div>
  );
}
