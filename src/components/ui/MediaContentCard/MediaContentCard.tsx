import { MediaContentCardProps } from "./MediaContentCard.types";

export default function MediaContentCard({
  title,
  description,
  children,
  className = "",
}: MediaContentCardProps) {
  return (
    <div
      className={`
        flex
        h-full
        flex-col
        bg-dark-blue
        p-8
        ${className}
      `}
    >
      <h3
        className="
          mb-5
          text-h5
          font-medium
          text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          text-body
          
          text-white
        "
      >
        {description}
      </p>

      {children && (
        <div className="mt-auto pt-8">
          {children}
        </div>
      )}
    </div>
  );
}