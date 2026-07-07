import { ContainerProps } from "./Container.types";

const sizes = {
  wide: "max-w-[1764px]",
  xl: "max-w-[1564px]",
  large: "max-w-[1494px]",
  standard: "max-w-[1424px]",
  content: "max-w-[1328px]",
  narrow: "max-w-[1216px]",
  reading: "max-w-[1129px]",
};

export default function Container({
  children,
  className = "",
  size = "wide",
}: ContainerProps) {
  return (
    <div
      className={`
        w-full
        mx-auto
        px-3
        md:px-4
        lg:px-8
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}