import Image from "next/image";
import type { ProductionScaleCardProps } from "./ProductionScaleCard.types";

export default function ProductionScaleCard({ image, name, capacity, className = "" }: ProductionScaleCardProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      <div>
        <h3 className="font-body text-body font-medium text-primary">{name}</h3>
        <p className="text-body-sm text-secondary">{capacity}</p>
      </div>
    </div>
  );
}
