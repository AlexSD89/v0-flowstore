import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-lg border bg-background-glass backdrop-blur-xl px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "border-border-primary text-text-primary",
          "focus-visible:border-cloudsway-primary-500",
          "focus-visible:ring-2 focus-visible:ring-cloudsway-primary-500/20"
        ],
        error: [
          "border-cloudsway-error text-text-primary",
          "focus-visible:border-cloudsway-error",
          "focus-visible:ring-2 focus-visible:ring-cloudsway-error/20"
        ],
        success: [
          "border-cloudsway-success text-text-primary",
          "focus-visible:border-cloudsway-success",
          "focus-visible:ring-2 focus-visible:ring-cloudsway-success/20"
        ]
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, leftIcon, rightIcon, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          
          <input
            className={cn(
              inputVariants({ variant: error ? "error" : variant, size }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs text-cloudsway-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };