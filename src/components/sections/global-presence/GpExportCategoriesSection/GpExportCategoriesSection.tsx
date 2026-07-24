import CategoryCard from "@/components/ui/CategoryCard";
import MobileSlider from "@/components/ui/MobileSlider";
import type { GpExportCategoriesSectionProps } from "./GpExportCategoriesSection.types";

export default function GpExportCategoriesSection({
  eyebrow,
  items,
  className = "",
}: GpExportCategoriesSectionProps) {
  return (
    <div className={`flex flex-col gap-[var(--spacing-subsection)] ${className}`}>
      <h2 className="font-heading text-h2 font-light text-primary text-center">{eyebrow}</h2>

      {/* No links/hover state yet — API sends an anchor field but it's deferred for now */}
      <MobileSlider desktopClassName="grid grid-cols-2 gap-[var(--spacing-gutter)] md:grid-cols-4">
        {items.map((item) => (
          <CategoryCard
            key={item.title}
            image={item.image}
            title={item.title}
            interactive={false}
            fillImage={false}
            imageClassName="bg-transparent"
          />
        ))}
      </MobileSlider>
    </div>
  );
}
