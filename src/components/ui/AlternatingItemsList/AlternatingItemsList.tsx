import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeading";
import type { AlternatingItemsListProps } from "./AlternatingItemsList.types";

export default function AlternatingItemsList({
  items,
  headingSize = "h2",
  headingFont = "heading",
  headingClassName = "",
  className = "",
}: AlternatingItemsListProps) {
  return (
    <div className={`flex flex-col gap-[var(--spacing-gutter)] ${className}`}>
      {items.map((item, i) => {
        const imageLeft = i % 2 === 0;
        return (
          <div key={item.title} className="grid items-center md:grid-cols-2">
            {/* Image — always first in DOM so mobile stacks image → text */}
            <div
              className={`relative aspect-[4/3] overflow-hidden rounded-lg ${
                imageLeft ? "" : "md:order-last"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Spacing via padding so image edges share the same 50% vertical line across rows */}
            <div className={imageLeft ? "mt-6 md:mt-0 md:pl-10 lg:pl-16" : "mt-6 md:mt-0 md:pr-10 lg:pr-16"}>
              {headingFont === "body" ? (
                <h3 className="text-[24px] font-medium leading-normal text-primary">
                  {item.title}
                </h3>
              ) : (
                <SectionHeader title={item.title} align="left" size={headingSize} headingClassName={headingClassName} />
              )}
              <p className="mt-5 text-body leading-6 text-secondary">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
