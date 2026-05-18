import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[#94a3b8]">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-[#16162a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-[#e2e8f0] placeholder:text-[#475569]",
              "focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed40] transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef444440]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
