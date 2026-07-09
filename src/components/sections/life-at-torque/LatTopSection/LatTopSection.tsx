import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import SafeHtml from "@/components/ui/SafeHtml";
import { SplitButton } from "@/components/ui/SplitButton";
import type { LatTopSectionProps } from "./LatTopSection.types";

// Figma-measured per-image layout: top offset + height (container = 533px at desktop)
// Image 3 spans full height; others sit at specific offsets creating the asymmetric collage
const GALLERY = [
  { mt: "mt-[80px] lg:mt-[130px]", h: "h-[260px] lg:h-[403px]", flex: "flex-[0.8]" },
  { mt: "mt-[30px] lg:mt-[50px]",  h: "h-[290px] lg:h-[453px]", flex: "flex-1" },
  { mt: "mt-0",                     h: "h-[340px] lg:h-[533px]", flex: "flex-[1.5]" },
  { mt: "mt-[60px] lg:mt-[96px]",  h: "h-[260px] lg:h-[403px]", flex: "flex-1" },
  { mt: "mt-0",                     h: "h-[260px] lg:h-[403px]", flex: "flex-[0.8]" },
];

export default function LatTopSection({
  eyebrow,
  title,
  description,
  button,
  gallery,
  className = "",
}: LatTopSectionProps) {
  return (
    <Section first className={className}>
      <Container size="wide">
        {/* Centered header — max-w matches Figma 1051px description width */}
        <div className="mx-auto mb-10 flex max-w-[66rem] flex-col items-center text-center lg:mb-14">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            align="center"
            variant="default"
            as="h1"
            size="h1"
          />
          {description && (
            <SafeHtml
              html={description}
              className="mt-5 text-body leading-6 text-secondary [&_b]:font-medium"
            />
          )}
          {button.label && (
            <SplitButton
              href={button.href}
              variant="primary"
              className="mt-8"
              labelClassName="flex-1 justify-center"
            >
              {button.label}
            </SplitButton>
          )}
        </div>

        {/* Staggered gallery — images arch from short outer to tall centre, bottom-aligned */}
        {gallery.length > 0 && (
          <div className="flex items-start gap-3 overflow-x-auto sm:overflow-visible lg:gap-4">
            {gallery.map((src, i) => (
              <div
                key={i}
                className={`relative shrink-0 overflow-hidden rounded-lg bg-surface min-w-[55vw] sm:min-w-0 ${GALLERY[i]?.flex ?? "flex-1"} ${GALLERY[i]?.h ?? "h-[340px]"} ${GALLERY[i]?.mt ?? "mt-0"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  loading={i === 2 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
                />
              </div>
            ))}
          </div> 
        )}
      </Container>
    </Section>
  );
}
