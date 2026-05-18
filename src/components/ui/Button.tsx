import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "premium";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-lg shadow-[#7c3aed30]": variant === "primary",
            "bg-[#06b6d4] text-white hover:bg-[#0891b2] shadow-lg shadow-[#06b6d430]": variant === "secondary",
            "border border-[#2a2a3e] text-[#e2e8f0] hover:bg-[#16162a]": variant === "outline",
            "text-[#e2e8f0] hover:bg-[#16162a]": variant === "ghost",
            "bg-[#ef4444] text-white hover:bg-[#dc2626]": variant === "danger",
            "bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white shadow-lg shadow-[#f59e0b30]": variant === "premium",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-3 text-base": size === "md",
            "px-6 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
