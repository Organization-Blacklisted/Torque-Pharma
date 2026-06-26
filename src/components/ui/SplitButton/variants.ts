/**
 * SplitButton visual presets.
 *
 * Filled variants (primary, secondary): label filled + icon outlined by default.
 * On hover they swap — label outlines, icon fills.
 *
 * Unfilled variants (outline, ghost): label + icon outlined by default.
 * On hover label fills, icon stays outlined (mirrors filled default).
 */
export const splitButtonVariants = {
  primary: {
    label:
      "border border-mint bg-mint text-white group-hover:bg-transparent group-hover:text-mint",
    icon:
      "border border-mint bg-transparent text-mint group-hover:bg-mint group-hover:text-white",
    root: "",
  },
  outline: {
    label:
      "border border-mint bg-transparent text-white group-hover:bg-mint group-hover:text-white",
    icon:
      "border border-mint bg-transparent text-white group-hover:bg-transparent group-hover:text-mint",
    root: "",
  },
  secondary: {
    label:
      "border border-primary bg-primary text-white group-hover:bg-transparent group-hover:text-primary",
    icon:
      "border border-primary bg-transparent text-primary group-hover:bg-primary group-hover:text-white",
    root: "",
  },
  "outline-dark": {
    label:
      "border border-mint bg-transparent text-dark-grey group-hover:bg-mint group-hover:text-white",
    icon:
      "border border-mint bg-transparent text-dark-grey group-hover:bg-transparent group-hover:text-mint",
    root: "",
  },
  ghost: {
    label:
      "border border-transparent bg-transparent text-mint group-hover:border-mint group-hover:bg-mint group-hover:text-white",
    icon:
      "border border-mint bg-transparent text-mint group-hover:bg-transparent",
    root: "",
  },
} as const;

export type SplitButtonVariant = keyof typeof splitButtonVariants;
