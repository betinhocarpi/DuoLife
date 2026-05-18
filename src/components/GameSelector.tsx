"use client";
import { useState } from "react";
import { GAMES, GAME_CATEGORIES } from "@/lib/games";
import type { Game } from "@/types";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface GameSelectorProps {
  selected: Game[];
  onChange: (games: Game[]) => void;
  max?: number;
}

export function GameSelector({ selected, onChange, max = 10 }: GameSelectorProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = GAMES.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory ? g.category === activeCategory : true;
    return matchSearch && matchCategory;
  });

  const toggle = (game: Game) => {
    const isSelected = selected.some((s) => s.id === game.id);
    if (isSelected) {
      onChange(selected.filter((s) => s.id !== game.id));
    } else if (selected.length < max) {
      onChange([...selected, game]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar jogo..."
          className="w-full bg-[#16162a] border border-[#2a2a3e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:border-[#7c3aed]"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            !activeCategory ? "bg-[#7c3aed] text-white" : "bg-[#16162a] text-[#64748b] border border-[#2a2a3e]"
          )}
        >
          Todos
        </button>
        {GAME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              cat === activeCategory ? "bg-[#7c3aed] text-white" : "bg-[#16162a] text-[#64748b] border border-[#2a2a3e]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((game) => (
            <span
              key={game.id}
              className="flex items-center gap-1.5 bg-[#7c3aed20] border border-[#7c3aed40] text-[#a78bfa] px-3 py-1 rounded-full text-xs font-medium"
            >
              {game.icon} {game.name}
              <button onClick={() => toggle(game)} className="hover:text-white">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto hide-scrollbar">
        {filtered.map((game) => {
          const isSelected = selected.some((s) => s.id === game.id);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <button
              key={game.id}
              onClick={() => toggle(game)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all",
                isSelected
                  ? "bg-[#7c3aed20] border-[#7c3aed] text-[#a78bfa]"
                  : "bg-[#16162a] border-[#2a2a3e] text-[#94a3b8] hover:border-[#7c3aed60]",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="text-base">{game.icon}</span>
              <div>
                <div className="font-medium leading-tight">{game.name}</div>
                <div className="text-[#475569] text-[10px]">{game.category}</div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-[#475569] text-right">
        {selected.length}/{max} jogos selecionados
      </p>
    </div>
  );
}
