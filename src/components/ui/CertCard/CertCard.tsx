import Image from "next/image";
import type { CertCardProps } from "./CertCard.types";

export default function CertCard({ image, label, onClick, className = "" }: CertCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-4 cursor-zoom-in text-left ${className}`}
    >
      <div className="w-full overflow-hidden">
        <Image
          src={image}
          alt={label}
          width={400}
          height={500}
          className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <p className="text-center text-h5 font-medium leading-6 text-secondary">
        {label}
      </p>
    </button>
  );
}
