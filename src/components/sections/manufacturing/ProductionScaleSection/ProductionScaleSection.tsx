import Container from "@/components/layouts/Container";
import Section from "@/components/layouts/Section";
import SectionHeader from "@/components/ui/SectionHeading";
import Slider from "@/components/ui/Slider";
import ProductionScaleCard from "@/components/ui/ProductionScaleCard";
import type { ProductionScaleSectionProps } from "./ProductionScaleSection.types";

export default function ProductionScaleSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: ProductionScaleSectionProps) {
  return (
    <Section className={`overflow-hidden ${className}`}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          variant="split"
          headingClassName="min-[991px]:max-w-[750px]"
        />
      </Container>
      {/* Own container matching wide padding so cards align with heading above;
          overflowVisible lets the track peek past the right edge to the section boundary */}
      <div className="mx-auto mt-[var(--spacing-subsection)] w-full max-w-[1700px] px-3 md:px-4 lg:px-8">
        <Slider
          visibleCount={{ default: 1, sm: 2, md: 3, lg: 5 }}
          overflowVisible
          showProgress={false}
          controlsAlign="center"
        >
          {items.map((item) => (
            <ProductionScaleCard
              key={item.name}
              image={item.image}
              name={item.name}
              capacity={item.capacity}
            />
          ))}
        </Slider>
      </div>
    </Section>
  );
}
