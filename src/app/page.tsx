import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Gamepad2, Heart, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gamer flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-2">
          <Gamepad2 size={28} className="text-[#7c3aed] drop-shadow-[0_0_8px_#7c3aed]" />
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
            DuoLife
          </span>
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Cadastrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-8">
        <div className="relative">
          <div className="absolute -inset-8 bg-[#7c3aed20] rounded-full blur-3xl animate-pulse-glow" />
          <div className="relative text-8xl animate-float">🎮</div>
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <h1 className="text-5xl font-black leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] glow-text-purple">
              Find Your
            </span>
            <br />
            <span className="text-[#e2e8f0]">Duo.</span>
          </h1>
          <p className="text-[#94a3b8] text-lg leading-relaxed">
            O primeiro app de relacionamento feito{" "}
            <span className="text-[#7c3aed] font-semibold">para gamers</span>.
            Encontre seu Duo para os games e para a vida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href="/register" className="flex-1">
            <Button size="lg" className="w-full">
              Começar grátis
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Já tenho conta
            </Button>
          </Link>
        </div>

        <p className="text-xs text-[#475569]">Sem cartão de crédito · Grátis para sempre no básico</p>
      </section>

      {/* Features */}
      <section className="px-6 py-12 border-t border-[#2a2a3e]">
        <h2 className="text-center text-2xl font-bold text-[#e2e8f0] mb-8">
          Feito para quem vive nos games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            {
              icon: <Gamepad2 className="text-[#7c3aed]" size={28} />,
              title: "Perfil Gamer",
              desc: "Mostre seus jogos, plataformas, rank e estilo de jogo.",
            },
            {
              icon: <Heart className="text-[#ef4444]" size={28} />,
              title: "Match Real",
              desc: "Combine com pessoas que jogam os mesmos títulos que você.",
            },
            {
              icon: <Zap className="text-[#f59e0b]" size={28} />,
              title: "Chat Direto",
              desc: "Bate-papo em tempo real quando der match. Zero enrolação.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-card-gamer border border-[#2a2a3e] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#7c3aed60] transition-all"
            >
              {icon}
              <h3 className="font-bold text-[#e2e8f0]">{title}</h3>
              <p className="text-sm text-[#64748b]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-10 bg-[#12121f] border-t border-[#2a2a3e]">
        <div className="flex justify-around max-w-sm mx-auto">
          {[
            { val: "30+", label: "Jogos" },
            { val: "100%", label: "Free to start" },
            { val: "∞", label: "Matches" },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
                {val}
              </span>
              <span className="text-xs text-[#64748b]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a3e]">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-[#475569]" />
          <span className="text-xs text-[#475569]">Safe & Seguro</span>
        </div>
        <span className="text-xs text-[#475569]">© 2025 DuoLife</span>
      </footer>
    </main>
  );
}
