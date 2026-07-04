import Image from "next/image";
import Container from "@/components/layouts/Container";
import SectionHeader from "@/components/ui/SectionHeading";
import type { WhiteLabelPartnerSectionProps, PartnerItem } from "./WhiteLabelPartnerSection.types";

function PartnerCard({ item }: { item: PartnerItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="relative aspect-square">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 30vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-body text-h5 text-white mb-2">{item.title}</h3>
        <p className="text-body-sm text-white/70">{item.description}</p>
      </div>
    </div>
  );
}

export default function WhiteLabelPartnerSection({
  eyebrow,
  heading,
  description,
  items,
  className = "",
}: WhiteLabelPartnerSectionProps) {
  const leftItems  = items.filter((_, i) => i % 2 === 0);
  const rightItems = items.filter((_, i) => i % 2 !== 0);

  return (
    <div className={`rounded-lg bg-dark-blue py-[var(--spacing-section-inner)] ${className}`}>
      <Container size="wide">
        <div className="flex flex-col min-[992px]:flex-row items-start justify-between gap-[var(--spacing-section-inner)]">
          <SectionHeader
            eyebrow={eyebrow}
            title={heading}
            description={description}
            theme="dark"
            eyebrowColor="text-white"
            className="max-w-[500px]"
          />
          {/* Mobile: single column */}
          <div className="flex flex-col gap-[var(--spacing-gutter)] w-full min-[992px]:hidden">
            {items.map((item) => (
              <PartnerCard key={item.title} item={item} />
            ))}
          </div>

          {/* Desktop: staggered two-column scroll */}
          <div className="hidden min-[992px]:block h-[640px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-[var(--spacing-gutter)]">
              <div className="flex w-full max-w-[366px] flex-col gap-[var(--spacing-gutter)]">
                {leftItems.map((item) => (
                  <PartnerCard key={item.title} item={item} />
                ))}
              </div>
              <div className="flex w-full max-w-[366px] flex-col gap-[var(--spacing-gutter)] mt-10">
                {rightItems.map((item) => (
                  <PartnerCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
