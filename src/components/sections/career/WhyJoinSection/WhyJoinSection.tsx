import Image from "next/image";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import Slider from "@/components/ui/Slider";
import type { WhyJoinSectionProps } from "./WhyJoinSection.types";

export default function WhyJoinSection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: WhyJoinSectionProps) {
  return (
    <div className={`rounded-lg bg-dark-blue py-[var(--spacing-section-inner)] ${className}`}>
      <Container size="wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={heading}
          description={description}
          align="center"
          theme="dark"
          size="h2"
          eyebrowColor="text-white"
          className="mx-auto max-w-[900px]"
        />

        <div className="mt-[var(--spacing-subsection)]">
          <Slider visibleCount={{ default: 1, sm: 2, lg: 3 }} peek={false}>
            {items.map((item) => (
              <div key={item.title} className="flex h-full flex-col border-r-[3px] border-white/20 p-[var(--spacing-subsection)]">
                <Image
                  src={item.icon}
                  alt=""
                  width={80}
                  height={80}
                  aria-hidden
                  className="mb-[var(--spacing-subsection)] object-contain"
                />
                <h3 className="mb-3 text-[20px] font-medium leading-6 text-white">{item.title}</h3>
                <p className="text-body font-normal text-white/70">{item.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </Container>
    </div>
  );
}
