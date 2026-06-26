import SectionHeader from "@/components/ui/SectionHeading";
import { SplitButton } from "@/components/ui/SplitButton";
import WorldMap from "@/components/ui/WorldMap";
import type { HomeGlobalPresenceSectionProps } from "./HomeGlobalPresenceSection.types";

export default function HomeGlobalPresenceSection({
  data: { eyebrow, heading, description, items },
  className = "",
}: HomeGlobalPresenceSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        eyebrow={eyebrow}
        title={heading}
        content={description}
        align="center"
        size="h2"
      />
      <WorldMap items={items} className="mt-10" />
      <div className="mt-10 flex justify-center">
        <SplitButton variant="primary" href="/global-presence">
          Explore More
        </SplitButton>
      </div>
    </div>
  );
}
