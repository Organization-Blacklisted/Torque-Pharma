import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import type { ProductCategoryHeroProps } from "./ProductCategoryHero.types";

export default function ProductCategoryHero({
  name,
  image,
  className = "",
}: ProductCategoryHeroProps) {
  return (
    <Section
      first
      spacing="none"
      className={`mt-[var(--spacing-page-top)] pb-0 ${className}`}
    >
      <Container size="wide" className="text-center mb-[var(--spacing-subsection)]">
        <h1 className="font-heading text-[2.5rem] lg:text-[4.375rem] font-light text-primary">
          {name}
        </h1>
      </Container>
      {image && (
        <div className="relative w-full aspect-[1920/730]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      )}
    </Section>
  );
}
