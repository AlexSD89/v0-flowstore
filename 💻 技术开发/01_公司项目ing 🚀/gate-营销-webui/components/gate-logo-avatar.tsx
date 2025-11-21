export function GateLogoAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-lg",
    lg: "w-16 h-16 text-2xl",
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-primary rounded-full flex items-center justify-center border-2 border-primary/20`}
    >
      <span className="text-primary-foreground font-bold">G</span>
    </div>
  )
}
