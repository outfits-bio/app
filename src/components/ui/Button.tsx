import { cn } from "@/utils/cn.util";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { PiSpinner, PiSpinnerGap } from "react-icons/pi";

const variants = cva(
  "font-semibold font-clash self-stretch h-12 py-2 gap-3 flex items-center",
  {
    variants: {
      variant: {
        primary:
          "bg-accent border-accent border dark:text-black text-white hover:opacity-[99%] dark:hover:bg-opacity-[99%] disabled:bg-opacity-80 dark:disabled:bg-opacity-80 active:scale-[99%]",
        outline:
          "border dark:border-stroke disabled:bg-hover bg-transparent hover:bg-hover transform transition duration-100 ease-in-out active:scale-[99%]",
        ghost:
          "border border-transparent hover:bg-hover disabled:bg-hover transform transition duration-100 ease-in-out active:scale-[99%]",
        "outline-ghost":
          "border border-stroke hover:bg-hover disabled:bg-hover transform transition duration-100 ease-in-out active:scale-[99%]",
      },
      centerItems: {
        true: "justify-center",
        false: "justify-between",
      },
      shape: {
        normal: "px-6 w-full rounded-xl",
        square: "w-12 px-2 rounded-xl justify-center",
        circle: "rounded-full px-2 w-12 justify-center",
      },
      accent: {
        true: "bg-accent border-accent",
        false: "",
      },
      orange: {
        true: "bg-orange-accent border-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      centerItems: false,
      shape: "normal",
      accent: false,
      orange: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof variants> {
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      isLoading,
      variant,
      centerItems,
      iconLeft,
      iconRight,
      shape,
      accent,
      orange,
      ...props
    },
    ref,
  ) => {
    if (variant === "outline-ghost" && accent) {
      variant = "primary";
    }

    if (iconLeft && !iconRight) {
      return (
        <button
          ref={ref}
          className={cn(
            variants({ centerItems, className, variant, shape, accent, orange }),
          )}
          disabled={isLoading}
          {...props}
        >
          {!isLoading && <div className="text-2xl">{iconLeft}</div>}
          {isLoading && <PiSpinnerGap className="animate-spin text-2xl" />}
          {children}
        </button>
      );
    }

    if (!iconLeft && iconRight) {
      return (
        <button
          ref={ref}
          className={cn(
            variants({ centerItems, className, variant, shape, accent, orange }),
          )}
          disabled={isLoading}
          {...props}
        >
          {isLoading && <PiSpinnerGap className="animate-spin text-2xl" />}
          {children}
          <div className="text-2xl">{iconRight}</div>
        </button>
      );
    }

    if (iconLeft && iconRight) {
      return (
        <button
          ref={ref}
          className={cn(
            variants({ centerItems, className, variant, shape, accent, orange }),
          )}
          disabled={isLoading}
          {...props}
        >
          {!isLoading && <div className="text-2xl">{iconLeft}</div>}
          {isLoading && <PiSpinnerGap className="animate-spin text-2xl" />}
          {children}
          <div className="text-2xl">{iconRight}</div>
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          variants({ centerItems, className, variant, shape, accent, orange }),
        )}
        disabled={isLoading}
        {...props}
      >
        {iconLeft && !isLoading && <div className="text-2xl">{iconLeft}</div>}
        {isLoading && <PiSpinner className="animate-spin text-2xl" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
