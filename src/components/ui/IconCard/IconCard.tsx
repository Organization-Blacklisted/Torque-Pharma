import Image from "next/image";
import type { IconCardProps } from "./IconCard.types";

export default function IconCard({
  image,
  title,
  subtitle,
  description,
  align = "center",
  className = "",
}: IconCardProps) {
  const isCenter = align === "center";

  return (
    <div className={`flex flex-col gap-4 ${isCenter ? "items-center text-center" : "items-start text-left"} ${className}`}>
      <div className="h-16 w-16 shrink-0">
        <Image src={image} alt="" aria-hidden width={64} height={64} className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-body text-body font-medium text-primary">{title}</h3>
        {subtitle && (
          <p className="font-body text-body-sm italic text-primary/70">{subtitle}</p>
        )}
      </div>
      <p className="text-h5 text-primary/60">{description}</p>
    </div>
  );
}
