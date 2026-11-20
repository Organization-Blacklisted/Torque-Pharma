import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import { ArrowIcon } from "@/components/ui/SplitButton/ArrowIcon";
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
                {item.button && (
                  <Link
                    href={item.button.href}
                    className="mt-6 inline-flex items-center gap-2 text-body-sm font-medium uppercase text-mint"
                  >
                    {item.button.label}
                    <ArrowIcon className="h-4 w-4 text-mint" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
