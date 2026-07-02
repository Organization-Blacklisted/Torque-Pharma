import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import SectionHeader from "@/components/ui/SectionHeading";
import IconCard from "@/components/ui/IconCard";
import type { QualityAssessmentSectionProps } from "./QualityAssessmentSection.types";

export default function QualityAssessmentSection({
  eyebrow,
  title,
  items,
  className = "",
}: QualityAssessmentSectionProps) {
  return (
    <Section className={className}>
      <Container size="content">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          align="center"
          className="mx-auto mb-12 max-w-[760px]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            const isTop = i < 2;

            return (
              <div
                key={item.title}
                className={[
                  "relative p-8 lg:p-12",
                  // Vertical line — left column, 35px inset from top and bottom of each cell
                  isLeft ? "sm:after:absolute sm:after:content-[''] sm:after:right-0 sm:after:top-[35px] sm:after:bottom-[35px] sm:after:w-0.5 sm:after:bg-primary/10" : "",
                  // Horizontal line — top row, 35px inset from left and right of each cell
                  isTop ? "sm:before:absolute sm:before:content-[''] sm:before:bottom-0 sm:before:left-[35px] sm:before:right-[35px] sm:before:h-0.5 sm:before:bg-primary/10" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <IconCard
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  align="center"
                />
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
