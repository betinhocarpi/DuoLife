"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GAMES, GAME_CATEGORIES } from "@/lib/games";
import type { Game } from "@/types";
import { cn } from "@/lib/utils";
import { Search, X, Check, Plus } from "lucide-react";
import Image from "next/image";

interface GameSelectorProps {
  selected: Game[];
  onChange: (games: Game[]) => void;
  max?: number;
}

export function GameSelector({ selected, onChange, max = 10 }: GameSelectorProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>(GAMES);
  const [categories, setCategories] = useState<string[]>(GAME_CATEGORIES);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("games")
      .select("id, name, category, icon, cover_url, rank")
      .eq("is_active", true)
      .order("rank", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setGames(data);
          setCategories([...new Set(data.map((g: Game) => g.category))].sort());
        }
      });
  }, []);

  const filtered = games.filter((g) => {
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

  const addCustom = () => {
    const name = customInput.trim();
    if (!name || selected.length >= max) return;
    // Check if already in list
    const existing = games.find((g) => g.name.toLowerCase() === name.toLowerCase());
    if (existing) { toggle(existing); setCustomInput(""); return; }
    // Check if already selected as custom
    const alreadySelected = selected.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (alreadySelected) { setCustomInput(""); return; }
    const custom: Game = { id: `custom_${Date.now()}`, name, category: "Outro", icon: "🎮" };
    onChange([...selected, custom]);
    setCustomInput("");
  };

  const customGames = selected.filter((s) => s.id.startsWith("custom_"));

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
        {categories.map((cat) => (
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

      <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto hide-scrollbar">
        {filtered.map((game) => {
          const isSelected = selected.some((s) => s.id === game.id);
          const isDisabled = !isSelected && selected.length >= max;
          return (
            <button
              key={game.id}
              onClick={() => toggle(game)}
              disabled={isDisabled}
              className={cn(
                "relative rounded-xl border overflow-hidden text-left transition-all",
                isSelected ? "border-[#7c3aed] ring-1 ring-[#7c3aed]" : "border-[#2a2a3e] hover:border-[#7c3aed60]",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {game.cover_url ? (
                <div className="relative w-full aspect-[16/9]">
                  <Image src={game.cover_url} alt={game.name} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-[#7c3aed] rounded-full p-0.5">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="text-white text-[11px] font-semibold leading-tight truncate">{game.name}</div>
                    <div className="text-white/50 text-[9px] truncate">{game.category}</div>
                  </div>
                </div>
              ) : (
                <div className={cn("flex items-center gap-2 p-2.5", isSelected ? "bg-[#7c3aed20]" : "bg-[#16162a]")}>
                  <span className="text-base">{game.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-medium leading-tight text-xs truncate", isSelected ? "text-[#a78bfa]" : "text-[#94a3b8]")}>{game.name}</div>
                    <div className="text-[#475569] text-[10px]">{game.category}</div>
                  </div>
                  {isSelected && <Check size={12} className="shrink-0 text-[#7c3aed]" />}
                </div>
              )}
            </button>
          );
        })}

        {/* Custom games already selected shown as cards */}
        {customGames.map((game) => (
          <button
            key={game.id}
            onClick={() => toggle(game)}
            className="relative rounded-xl border border-[#7c3aed] ring-1 ring-[#7c3aed] overflow-hidden text-left transition-all"
          >
            <div className="flex items-center gap-2 p-2.5 bg-[#7c3aed20]">
              <span className="text-base">🎮</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium leading-tight text-xs truncate text-[#a78bfa]">{game.name}</div>
                <div className="text-[#475569] text-[10px]">Personalizado</div>
              </div>
              <X size={12} className="shrink-0 text-[#7c3aed]" />
            </div>
          </button>
        ))}
      </div>

      {/* Custom game input */}
      <div className="flex gap-2">
        <input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          placeholder="Não achou? Adicione manualmente..."
          className="flex-1 bg-[#16162a] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-sm text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:border-[#06b6d4]"
        />
        <button
          onClick={addCustom}
          disabled={!customInput.trim() || selected.length >= max}
          className="shrink-0 bg-[#06b6d420] border border-[#06b6d4] text-[#22d3ee] rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-[#06b6d440] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="text-[10px] text-[#475569] text-right">
        {selected.length}/{max} jogos selecionados
      </p>
    </div>
  );
}
