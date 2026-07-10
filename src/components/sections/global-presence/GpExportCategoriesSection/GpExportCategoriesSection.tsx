import CategoryCard from "@/components/ui/CategoryCard";
import type { GpExportCategoriesSectionProps } from "./GpExportCategoriesSection.types";

export default function GpExportCategoriesSection({
  eyebrow,
  items,
  className = "",
}: GpExportCategoriesSectionProps) {
  return (
    <div className={`flex flex-col gap-[var(--spacing-subsection)] ${className}`}>
      <h2 className="font-heading text-h2 font-light text-primary text-center">{eyebrow}</h2>

      <div className="grid grid-cols-2 gap-[var(--spacing-gutter)] md:grid-cols-4">
        {items.map((item) => (
          <CategoryCard
            key={item.title}
            image={item.image}
            title={item.title}
            href={item.href !== "#" ? item.href : undefined}
            fillImage={false}
            imageClassName="bg-transparent"
          />
        ))}
      </div>
    </div>
  );
}
