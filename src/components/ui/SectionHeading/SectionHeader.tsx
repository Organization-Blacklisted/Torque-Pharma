import SafeHtml from "@/components/ui/SafeHtml/SafeHtml";
import { SectionHeaderProps } from "./SectionHeader.types";

const headingSizes: Record<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", string> = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  content,
  children,
  eyebrowColor = "text-primary",
  eyebrowDotColor = "bg-mint",
  as = "h2",
  size = "h2",
  align = "left",
  theme = "light",
  className = "",
  headingClassName = "",
  descriptionClassName = "",
  variant = "default",
}: SectionHeaderProps) {
  const HeadingTag = as;

  const alignment =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  const titleColor =
    theme === "dark" ? "text-white" : "text-primary";

  const descriptionColor =
    theme === "dark" ? "text-white/80" : "text-secondary";

  if (variant === "split") {
    return (
      <div
        className={`
          grid
          gap-8
          lg:grid-cols-12
          lg:items-end
          ${className}
        `}
      >
          <div className="lg:col-span-7">
          {eyebrow && (
            <div className="mb-4 inline-flex items-center gap-2.5">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${eyebrowDotColor}`}
              />

              <span
                className={`
                  text-eyebrow
                  uppercase
                  font-medium
                   ${eyebrowColor}
                `}
              >
                {eyebrow}
              </span>

              <span
                className={`h-2 w-2 shrink-0 rounded-full ${eyebrowDotColor}`}
              />
            </div>
          )}

          {title && (
            <HeadingTag
              className={`
                font-heading
                font-light
                ${headingSizes[size]}
                leading-[1.1]
                ${titleColor}
                ${headingClassName}
              `}
            >
              {title}
            </HeadingTag>
          )}
        </div>
  <div className="lg:col-span-5">
        {description && (
          <p
            className={`
              text-body
              leading-6
              ${descriptionColor}
              ${descriptionClassName}
            `}
          >
            {description}
          </p>
        )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <div className="mb-4 inline-flex items-center gap-2.5">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${eyebrowDotColor}`}
          />

          <span
            className={`text-eyebrow uppercase font-medium ${eyebrowColor}`}
          >
            {eyebrow}
          </span>

          <span
            className={`h-2 w-2 shrink-0 rounded-full ${eyebrowDotColor}`}
          />
        </div>
      )}

      {title && (
        <HeadingTag
          className={`
            font-heading
            font-light
            ${headingSizes[size]}
            leading-[1.1]
            ${titleColor}
            ${headingClassName}
          `}
        >
          {title}
        </HeadingTag>
      )}

      {description && (
        <p
          className={`
            mt-5
            text-body
            leading-6
            ${descriptionColor}
            ${descriptionClassName}
          `}
        >
          {description}
        </p>
      )}

      {content && (
        <SafeHtml
          html={content}
          className={`
            mt-5
          
            text-body
            leading-6
            ${descriptionColor}
            [&>p+p]:mt-6
          `}
        />
      )}

      {children && (
        <div
          className={`
            mt-5
            max-w-4xl
            text-body
            leading-6
            ${descriptionColor}
            space-y-6
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}