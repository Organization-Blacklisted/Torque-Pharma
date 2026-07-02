import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import Slider from "@/components/ui/Slider";
import ProcessStepCard from "@/components/ui/ProcessStepCard";
import type { ManufacturingProcessSectionProps } from "./ManufacturingProcessSection.types";

export default function ManufacturingProcessSection({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: ManufacturingProcessSectionProps) {
  return (
    <div className={`overflow-hidden rounded-lg bg-dark-blue py-[var(--spacing-section-inner)] ${className}`}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          variant="split"
          theme="dark"
          eyebrowColor="text-mint"
        />
      </Container>
      {/* Own container matching Container wide's padding/max-width so controls align with
          the heading above, while overflowVisible lets the track peek past the right edge */}
      <div className="mx-auto mt-[var(--spacing-subsection)] w-full max-w-[1700px] px-3 md:px-4 lg:px-8">
        <Slider visibleCount={{ default: 1, sm: 2, lg: 4 }} overflowVisible>
          {items.map((item, i) => (
            <ProcessStepCard key={i} step={i + 1} title={item.title} description={item.description} />
          ))}
        </Slider>
      </div>
    </div>
  );
}
