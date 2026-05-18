"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GameSelector } from "@/components/GameSelector";
import { Mail, Lock, User, ChevronRight, ChevronLeft } from "lucide-react";
import type { Game, Platform, PlayStyle, Gender, LookingFor } from "@/types";

const step1Schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  age: z.number({ error: "Idade obrigatória" }).min(18, "Você precisa ter 18+").max(99),
});
type Step1Data = z.infer<typeof step1Schema>;

const PLATFORMS: Platform[] = ["PC", "PS5", "Xbox", "Switch", "Mobile"];
const PLAY_STYLES: PlayStyle[] = ["Casual", "Competitivo", "Ambos"];
const GENDERS: Gender[] = ["Homem", "Mulher", "Não-binário", "Prefiro não dizer"];
const LOOKING_FOR: LookingFor[] = ["Duo de game", "Amizade", "Relacionamento", "Qualquer coisa"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 data
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  // Step 2 data
  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [playStyle, setPlayStyle] = useState<PlayStyle>("Ambos");
  const [gender, setGender] = useState<Gender>("Prefiro não dizer");
  const [lookingFor, setLookingFor] = useState<LookingFor>("Qualquer coisa");
  const [bio, setBio] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const onStep1 = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const onFinish = async () => {
    if (!step1Data) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: authData, error: signUpErr } = await supabase.auth.signUp({
      email: step1Data.email,
      password: step1Data.password,
    });

    if (signUpErr || !authData.user) {
      setError(signUpErr?.message ?? "Erro ao criar conta");
      setLoading(false);
      return;
    }

    const { error: profileErr } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      name: step1Data.name,
      age: step1Data.age,
      bio,
      games,
      platforms,
      play_style: playStyle,
      gender,
      looking_for: lookingFor,
    });

    if (profileErr) {
      setError("Erro ao criar perfil. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/discover");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              s <= step ? "bg-[#7c3aed]" : "bg-[#2a2a3e]"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">👾</div>
            <h1 className="text-2xl font-black text-[#e2e8f0]">Criar conta</h1>
            <p className="text-[#64748b] text-sm">Passo 1 de 2 · Dados básicos</p>
          </div>

          <form onSubmit={handleSubmit(onStep1)} className="flex flex-col gap-4">
            <Input
              label="Nome / Nick"
              placeholder="Como te chamam?"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Idade"
              type="number"
              placeholder="18"
              error={errors.age?.message}
              {...register("age", { valueAsNumber: true })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" size="lg" className="w-full mt-2 gap-2">
              Próximo <ChevronRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748b]">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#7c3aed] font-semibold hover:text-[#a78bfa]">
              Entrar
            </Link>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="text-[#64748b] hover:text-[#e2e8f0]">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black text-[#e2e8f0]">Perfil Gamer</h1>
              <p className="text-[#64748b] text-xs">Passo 2 de 2 · Seu estilo</p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#94a3b8]">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale sobre você, seu setup, como costuma jogar..."
              rows={3}
              maxLength={300}
              className="w-full bg-[#16162a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:border-[#7c3aed] resize-none text-sm"
            />
            <p className="text-[10px] text-[#475569] text-right">{bio.length}/300</p>
          </div>

          {/* Platforms */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Plataformas</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    platforms.includes(p)
                      ? "bg-[#7c3aed20] border-[#7c3aed] text-[#a78bfa]"
                      : "bg-[#16162a] border-[#2a2a3e] text-[#64748b]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Play Style */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Estilo de jogo</label>
            <div className="flex gap-2">
              {PLAY_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setPlayStyle(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    playStyle === s
                      ? "bg-[#7c3aed20] border-[#7c3aed] text-[#a78bfa]"
                      : "bg-[#16162a] border-[#2a2a3e] text-[#64748b]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Gênero</label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    gender === g
                      ? "bg-[#06b6d420] border-[#06b6d4] text-[#22d3ee]"
                      : "bg-[#16162a] border-[#2a2a3e] text-[#64748b]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Procurando</label>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR.map((l) => (
                <button
                  key={l}
                  onClick={() => setLookingFor(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    lookingFor === l
                      ? "bg-[#f59e0b20] border-[#f59e0b] text-[#fbbf24]"
                      : "bg-[#16162a] border-[#2a2a3e] text-[#64748b]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Games */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Jogos que você joga</label>
            <GameSelector selected={games} onChange={setGames} />
          </div>

          {error && (
            <div className="bg-[#ef444420] border border-[#ef4444] rounded-xl px-4 py-3 text-sm text-[#ef4444]">
              {error}
            </div>
          )}

          <Button onClick={onFinish} loading={loading} size="lg" className="w-full">
            Criar meu perfil 🎮
          </Button>
        </div>
      )}
    </div>
  );
}
