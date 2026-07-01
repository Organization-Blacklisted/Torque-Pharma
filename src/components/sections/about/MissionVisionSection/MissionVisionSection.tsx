import AlternatingItemsList from "@/components/ui/AlternatingItemsList";
import type { MissionVisionSectionProps } from "./MissionVisionSection.types";

export default function MissionVisionSection({ items, className = "" }: MissionVisionSectionProps) {
  return <AlternatingItemsList items={items} headingSize="h1" headingClassName="md:max-w-[190px]" className={className} />;
}
