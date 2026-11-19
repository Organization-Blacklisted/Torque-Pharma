import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import type { ExmCapabilitiesSectionProps } from "./ExmCapabilitiesSection.types";

export default function ExmCapabilitiesSection({
  eyebrow,
  title,
  items,
  className = "",
}: ExmCapabilitiesSectionProps) {
  return (
    <Section className={className}>
      <Container size={items.length === 3 ? "wide" : "standard"}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          titleHtml
          align="center"
          className="mx-auto mb-[var(--spacing-section-inner)] max-w-[1000px]"
        />
        <div
          className={`grid grid-cols-1 gap-[var(--spacing-gutter)] ${
            items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {items.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-lg bg-white">
              <div className={`relative w-full ${items.length === 3 ? "aspect-[544/330]" : "aspect-[650/330]"}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <p className="text-h5 font-medium text-primary">{item.title}</p>
                <p className="mt-4 text-body text-primary/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
