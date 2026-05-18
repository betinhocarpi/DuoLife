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
import { Mail, Lock, Gamepad2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword(data);
    if (err) {
      setError("Email ou senha incorretos");
      setLoading(false);
    } else {
      router.push("/discover");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <div className="text-5xl mb-2">🎮</div>
        <h1 className="text-2xl font-black text-[#e2e8f0]">Bem-vindo de volta</h1>
        <p className="text-[#64748b] text-sm">Entre na sua conta DuoLife</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          placeholder="••••••••"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          {...register("password")}
        />

        {error && (
          <div className="bg-[#ef444420] border border-[#ef44444] rounded-xl px-4 py-3 text-sm text-[#ef4444]">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
          <Gamepad2 size={18} /> Entrar
        </Button>
      </form>

      <p className="text-center text-sm text-[#64748b]">
        Não tem conta?{" "}
        <Link href="/register" className="text-[#7c3aed] font-semibold hover:text-[#a78bfa]">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
}
