import Image from "next/image";
import Section from "@/components/layouts/Section";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import type { LatBeyondJobSectionProps } from "./LatBeyondJobSection.types";

export default function LatBeyondJobSection({
  eyebrow,
  title,
  columns,
  className = "",
}: LatBeyondJobSectionProps) {
  return (
    <Section className={className}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          align="center"
          variant="default"
          className="mb-10 lg:mb-14"
        />

        {/* Figma stagger: col 1 drops ~35% from top; cols 2–4 start at top */}
        <div className="overflow-x-auto md:overflow-visible">
        <div className="grid grid-cols-[repeat(4,55vw)] md:grid-cols-4 gap-[clamp(1rem,3vw,2.625rem)]">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className={`flex flex-col gap-[clamp(1rem,3vw,2.625rem)] ${colIdx === 0 ? "pt-[200px]" : colIdx === 1 ? "pt-[100px]" : colIdx === 3 ? "pt-[150px]" : ""}`}>
              {col.map((src, imgIdx) => (
                <div key={imgIdx} className="overflow-hidden rounded-lg bg-surface">
                  <Image
                    src={src}
                    alt=""
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
      </Container>
    </Section>
  );
}
