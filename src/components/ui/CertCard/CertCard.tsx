import Image from "next/image";
import type { CertCardProps } from "./CertCard.types";

export default function CertCard({ image, label, className = "" }: CertCardProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="w-full">
        <Image
          src={image}
          alt={label}
          width={400}
          height={500}
          className="h-auto w-full object-contain"
          unoptimized
        />
      </div>
      <p className="text-center text-h5 font-medium leading-6 text-secondary">
        {label}
      </p>
    </div>
  );
}
