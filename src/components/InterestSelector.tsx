"use client";
import { INTERESTS } from "@/lib/interests";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
  max?: number;
}

export function InterestSelector({ selected, onChange, max = 10 }: InterestSelectorProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest.id);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <button
              key={interest.id}
              onClick={() => toggle(interest.id)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all",
                isSelected
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white shadow-[0_0_12px_#7c3aed60]"
                  : "bg-[#16162a] border-[#2a2a3e] text-[#64748b] hover:border-[#7c3aed60] hover:text-[#94a3b8]",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <span>{interest.icon}</span>
              {interest.label}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-[#475569] text-right">
        {selected.length}/{max} interesses selecionados
      </p>
    </div>
  );
}
