import { ContainerProps } from "./Container.types";

const sizes = {
  wide: "max-w-[1700px]",
  xl: "max-w-[1500px]",
  large: "max-w-[1410px]",
  standard: "max-w-[1360px]",
  content: "max-w-[1264px]",
  narrow: "max-w-[1152px]",
  reading: "max-w-[1065px]",
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