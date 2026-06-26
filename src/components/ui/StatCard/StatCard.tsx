import { StatCardProps } from "./StatCard.types";

export default function StatCard({
  label,
  value,
  suffix,
  description,
  theme = "light",
  className = "",
    showDots = false,
    isFirstDotActive = true,
}: StatCardProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`
        flex
        h-full
        flex-col
        rounded-lg
        p-[clamp(1rem,2vw,2rem)]
        py-[clamp(1.5rem,2vw,2.5rem)]
        ${isDark ? "bg-dark-blue" : "bg-white"}
        ${className}
      `}
    >
{showDots && (
  <div className="mb-4 flex gap-1">
    <span
      className={`
        h-2.5
        w-2.5
        rounded-full
        bg-mint
        ${isFirstDotActive ? "opacity-100" : "opacity-30"}
      `}
    />

    <span
      className={`
        h-2.5
        w-2.5
        rounded-full
        bg-mint
        ${!isFirstDotActive ? "opacity-100" : "opacity-30"}
      `}
    />
  </div>
)}
      {label && (
        <div className="flex-grow">
          <p
            className={`
              text-button
              uppercase
              font-medium
              font-body
              ${isDark ? "text-white" : "text-lightgray"}
            `}
          >
            {label}
          </p>
        </div>
      )}

      <div className={`mb-3 ${label ? "mt-[80px]" : "mt-auto"}`}>
        <span
          className={`
            font-heading
            text-xl-h
            leading-none
            ${isDark ? "text-mint" : "text-mint"}
          `}
        >
          {value}
        </span>
        {suffix && (
          <span
            className={`
              ml-1
              font-heading
              text-h3
              ${isDark ? "text-mint" : "text-mint"}
            `}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        className={`
          font-body
          text-body
          leading-6
          ${isDark ? "text-white/80" : "text-secondary"}
        `}
      >
        {description}
      </p>
    </div>
  );
}