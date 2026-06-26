import { CTAProps } from "./CTA.types";

import SectionHeader from "@/components/ui/SectionHeading";

export default function CTA({
  eyebrow,
  title,
  description,
  variant = "glass",
  children,
  className = "",
}: CTAProps) {
  const variants = {
    glass: `
      bg-white/60
      backdrop-blur-sm
    `,
   gradient:"cta-gradient",
  };

  return (
    <section
      className={`
        rounded-lg
        px-[clamp(1.5rem,_5vw,_5rem)]
        py-10
        ${variants[variant]}
        ${className}
      `}
    >
      <div
        className="
          grid
          grid-cols-1
          gap-8
          lg:grid-cols-[1fr_auto]
          lg:items-center
        "
      >
        <div className="max-w-[900px]">
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            eyebrowDotColor={variant === "glass" ? "bg-mint" : "bg-primary"}
            size="h2"
            className="mb-0"
          />
          {description && (
            <p className="mt-5 text-body font-light leading-6 text-secondary">
              {description}
            </p>
          )}
        </div>

        {children && (
          <div className="lg:justify-self-end">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}