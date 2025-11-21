import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: [
          "bg-cloudsway-primary-500/10 text-cloudsway-primary-500",
          "border border-cloudsway-primary-500/20"
        ],
        secondary: [
          "bg-cloudsway-secondary-500/10 text-cloudsway-secondary-500", 
          "border border-cloudsway-secondary-500/20"
        ],
        success: [
          "bg-cloudsway-success/10 text-cloudsway-success",
          "border border-cloudsway-success/20"
        ],
        warning: [
          "bg-cloudsway-warning/10 text-cloudsway-warning",
          "border border-cloudsway-warning/20"
        ],
        error: [
          "bg-cloudsway-error/10 text-cloudsway-error",
          "border border-cloudsway-error/20"
        ],
        // 6角色专属徽章
        alex: [
          "bg-blue-500/10 text-blue-500",
          "border border-blue-500/20"
        ],
        sarah: [
          "bg-purple-500/10 text-purple-500",
          "border border-purple-500/20"
        ],
        mike: [
          "bg-green-500/10 text-green-500",
          "border border-green-500/20"
        ],
        emma: [
          "bg-orange-500/10 text-orange-500", 
          "border border-orange-500/20"
        ],
        david: [
          "bg-indigo-500/10 text-indigo-500",
          "border border-indigo-500/20"  
        ],
        catherine: [
          "bg-pink-500/10 text-pink-500",
          "border border-pink-500/20"
        ],
        // 产品类型徽章
        workforce: [
          "bg-blue-500/10 text-blue-500",
          "border border-blue-500/20"
        ],
        expert: [
          "bg-purple-500/10 text-purple-500",
          "border border-purple-500/20"
        ],
        report: [
          "bg-green-500/10 text-green-500",
          "border border-green-500/20"
        ]
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs", 
        lg: "px-3 py-1 text-sm"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, removable, onRemove, children, ...props }, ref) => {
    return (
      <div 
        className={cn(badgeVariants({ variant, size }), className)} 
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && (
          <button
            className="ml-1 rounded-full hover:bg-current/20 p-0.5"
            onClick={onRemove}
            type="button"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };