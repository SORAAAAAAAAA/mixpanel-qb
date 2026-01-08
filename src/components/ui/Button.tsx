import { variantStyles } from "@/lib/constants";
import { ButtonVariant } from "@/types/ui/index";
import { cn } from "@/lib/utils";


export default function Button({
  children,
  onClick,
  variant,
  disabled = false,
  className,
  size = "md",
  ...props
}: {
  children: React.ReactNode
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  variant: ButtonVariant
  disabled?: boolean
  className?: string
  size?: "sm" | "md" | "lg" | "icon"
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
    icon: "p-2 w-10 h-10",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        `${variantStyles[variant]} font-bold rounded rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`,
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}