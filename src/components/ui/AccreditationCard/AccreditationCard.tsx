import Image from "next/image";
import type { AccreditationCardProps } from "./AccreditationCard.types";

export default function AccreditationCard({
  image,
  title,
  desc,
  className = "",
}: AccreditationCardProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-lg bg-white/20 p-[clamp(16px,_2.5vw,_30px)] text-center ${className}`}
    >
      <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full bg-white p-4">
        <Image
          src={image}
          alt={title}
          width={144}
          height={144}
          className="h-full w-full object-contain"
          unoptimized
        />
      </div>
      <p className="flex-1 whitespace-pre-line text-h5 text-secondary">{desc}</p>
      <p className="text-h5 font-medium uppercase text-secondary">{title}</p>
    </div>
  );
}
