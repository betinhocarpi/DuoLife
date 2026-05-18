"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Crown, Star, Zap, Heart, Eye, RotateCcw, Check, X } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "DuoLife Basic",
    price: "Grátis",
    period: "",
    color: "border-[#2a2a3e]",
    badge: null,
    features: [
      { text: "Swipes ilimitados", ok: true },
      { text: "Chat com matches", ok: true },
      { text: "Perfil básico", ok: true },
      { text: "Super Likes", ok: false },
      { text: "Boost de perfil", ok: false },
      { text: "Ver quem curtiu você", ok: false },
      { text: "Desfazer swipe", ok: false },
      { text: "Filtros avançados", ok: false },
    ],
  },
  {
    id: "gold",
    name: "DuoLife Gold",
    price: "R$ 29,90",
    period: "/mês",
    color: "border-[#f59e0b]",
    badge: "MAIS POPULAR",
    features: [
      { text: "Swipes ilimitados", ok: true },
      { text: "Chat com matches", ok: true },
      { text: "Perfil Premium", ok: true },
      { text: "5 Super Likes/dia", ok: true },
      { text: "1 Boost por mês", ok: true },
      { text: "Ver quem curtiu você", ok: true },
      { text: "Desfazer swipe", ok: true },
      { text: "Filtros avançados", ok: false },
    ],
  },
  {
    id: "platinum",
    name: "DuoLife Platinum",
    price: "R$ 59,90",
    period: "/mês",
    color: "border-[#7c3aed]",
    badge: "TUDO INCLUSO",
    features: [
      { text: "Swipes ilimitados", ok: true },
      { text: "Chat com matches", ok: true },
      { text: "Perfil Platinum", ok: true },
      { text: "Super Likes ilimitados", ok: true },
      { text: "Boosts ilimitados", ok: true },
      { text: "Ver quem curtiu você", ok: true },
      { text: "Desfazer swipe", ok: true },
      { text: "Filtros avançados", ok: true },
    ],
  },
];

const PERKS = [
  { icon: <Star size={20} className="text-[#f59e0b]" />, label: "Super Like", desc: "Destaque-se na fila" },
  { icon: <Zap size={20} className="text-[#7c3aed]" />, label: "Boost", desc: "Apareça para mais gamers" },
  { icon: <Eye size={20} className="text-[#06b6d4]" />, label: "Quem curtiu", desc: "Veja seus admiradores" },
  { icon: <RotateCcw size={20} className="text-[#10b981]" />, label: "Rewind", desc: "Desfaça o último swipe" },
];

export default function PremiumPage() {
  const [selected, setSelected] = useState("gold");

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar pb-6">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#2a1550] to-[#090910] px-5 pt-8 pb-6 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,#7c3aed,transparent)]" />
        <Crown size={48} className="mx-auto mb-3 text-[#f59e0b] drop-shadow-[0_0_20px_#f59e0b]" />
        <h1 className="text-2xl font-black text-[#e2e8f0]">DuoLife Premium</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Encontre seu Duo muito mais rápido</p>
      </div>

      {/* Perks */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          {PERKS.map(({ icon, label, desc }) => (
            <div key={label} className="bg-[#16162a] border border-[#2a2a3e] rounded-xl p-3 flex flex-col gap-2">
              {icon}
              <div>
                <div className="text-sm font-semibold text-[#e2e8f0]">{label}</div>
                <div className="text-xs text-[#64748b]">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="px-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-[#64748b] uppercase">Escolha seu plano</h2>
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`relative border-2 rounded-2xl p-4 text-left transition-all ${
              selected === plan.id
                ? plan.color + " bg-[#16162a]"
                : "border-[#1a1a2e] bg-[#12121f]"
            }`}
          >
            {plan.badge && (
              <div className={`absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                plan.id === "gold" ? "bg-[#f59e0b]" : "bg-[#7c3aed]"
              }`}>
                {plan.badge}
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-[#e2e8f0]">{plan.name}</div>
                <div className="flex items-baseline gap-0.5">
                  <span className={`text-2xl font-black ${plan.id === "basic" ? "text-[#94a3b8]" : "text-[#e2e8f0]"}`}>
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#64748b]">{plan.period}</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === plan.id ? "border-[#7c3aed] bg-[#7c3aed]" : "border-[#2a2a3e]"
              }`}>
                {selected === plan.id && <Check size={12} className="text-white" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {plan.features.map(({ text, ok }) => (
                <div key={text} className="flex items-center gap-1.5">
                  {ok
                    ? <Check size={12} className="text-[#10b981] shrink-0" />
                    : <X size={12} className="text-[#2a2a3e] shrink-0" />}
                  <span className={`text-[11px] ${ok ? "text-[#94a3b8]" : "text-[#2a2a3e]"}`}>{text}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="px-5 pt-5">
        {selected === "basic" ? (
          <Button variant="outline" size="lg" className="w-full" disabled>
            Plano atual
          </Button>
        ) : (
          <Button variant="premium" size="lg" className="w-full gap-2">
            <Crown size={18} />
            Assinar {PLANS.find((p) => p.id === selected)?.name}
          </Button>
        )}
        <p className="text-center text-[10px] text-[#475569] mt-3">
          Cancele quando quiser · Renovação automática mensal
        </p>
      </div>

      {/* Social proof */}
      <div className="mx-5 mt-4 bg-[#16162a] border border-[#2a2a3e] rounded-xl p-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {["A","B","C","D"].map((l) => (
            <div key={l} className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs font-bold text-white border-2 border-[#16162a]">
              {l}
            </div>
          ))}
        </div>
        <div>
          <div className="flex">{"⭐".repeat(5)}</div>
          <p className="text-xs text-[#64748b]">+12.000 gamers premium já encontraram seu Duo</p>
        </div>
      </div>
    </div>
  );
}
