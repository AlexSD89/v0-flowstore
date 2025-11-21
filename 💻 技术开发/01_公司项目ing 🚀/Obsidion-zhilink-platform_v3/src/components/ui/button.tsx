import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-cloudsway-primary-500 to-cloudsway-accent-500",
          "text-white shadow-lg shadow-cloudsway-primary-500/30",
          "hover:shadow-xl hover:shadow-cloudsway-primary-500/40",
          "hover:-translate-y-0.5 focus-visible:ring-cloudsway-primary-500",
        ],
        secondary: [
          "bg-background-glass backdrop-blur-xl border border-border-primary",
          "text-text-primary hover:bg-background-glass/80",
          "hover:-translate-y-0.5 focus-visible:ring-cloudsway-secondary-500",
        ],
        ghost: [
          "text-text-secondary hover:bg-background-glass hover:text-text-primary",
          "focus-visible:ring-cloudsway-primary-500",
        ],
        outline: [
          "border border-border-primary text-text-primary",
          "hover:bg-background-glass hover:border-border-accent",
          "focus-visible:ring-cloudsway-primary-500",
        ],
        destructive: [
          "bg-status-error text-white shadow-lg shadow-red-500/30",
          "hover:bg-red-600 focus-visible:ring-red-500",
        ],
        link: [
          "text-cloudsway-primary-500 underline-offset-4 hover:underline",
          "focus-visible:ring-cloudsway-primary-500",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };