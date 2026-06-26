"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { AnimatedArrow } from "./AnimatedArrow";
import { splitButtonVariants, type SplitButtonVariant } from "./variants";

type BaseProps = {
  children: ReactNode;
  variant?: SplitButtonVariant;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  iconClassName?: string;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

export type SplitButtonProps = LinkProps | ButtonProps;

const baseRoot =
  "group inline-flex items-stretch gap-1 rounded-sm no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 disabled:pointer-events-none aria-disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50";

const baseLabel =
  "flex items-center rounded-sm px-6 py-3 font-body text-sm font-medium uppercase tracking-[0.08em] transition-colors duration-300 ease-out";

const baseIcon =
  "relative flex min-h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-sm border transition-colors duration-300 ease-out";

function joinClasses(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function SplitButtonContent({
  children,
  variant,
  labelClassName,
  iconClassName,
}: Pick<
  SplitButtonProps,
  "children" | "variant" | "labelClassName" | "iconClassName"
>) {
  const styles = splitButtonVariants[variant ?? "primary"];

  return (
    <>
      <span className={joinClasses(baseLabel, styles.label, labelClassName)}>
        {children}
      </span>
      <span
        className={joinClasses(baseIcon, styles.icon, iconClassName)}
        aria-hidden="true"
      >
        <AnimatedArrow />
      </span>
    </>
  );
}

export function SplitButton({
  children,
  variant = "primary",
  disabled = false,
  className,
  labelClassName,
  iconClassName,
  ...props
}: SplitButtonProps) {
  const styles = splitButtonVariants[variant];
  const rootClassName = joinClasses(baseRoot, styles.root, className);

  if ("href" in props && props.href) {
    const { href, external } = props;

    if (external) {
      return (
        <a
          href={disabled ? undefined : href}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          className={rootClassName}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          <SplitButtonContent
            variant={variant}
            labelClassName={labelClassName}
            iconClassName={iconClassName}
          >
            {children}
          </SplitButtonContent>
        </a>
      );
    }

    return (
      <Link
        href={href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={rootClassName}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
      >
        <SplitButtonContent
          variant={variant}
          labelClassName={labelClassName}
          iconClassName={iconClassName}
        >
          {children}
        </SplitButtonContent>
      </Link>
    );
  }

  const { onClick, type = "button" } = props as ButtonProps;
  const buttonProps: ComponentPropsWithoutRef<"button"> = {
    type,
    disabled,
    onClick,
    className: rootClassName,
  };

  return (
    <button {...buttonProps}>
      <SplitButtonContent
        variant={variant}
        labelClassName={labelClassName}
        iconClassName={iconClassName}
      >
        {children}
      </SplitButtonContent>
    </button>
  );
}
