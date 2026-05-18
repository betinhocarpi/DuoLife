"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getAvatarUrl, formatTimeAgo } from "@/lib/utils";
import { MessageCircle, Heart } from "lucide-react";
import type { Match, Profile } from "@/types";

interface MatchWithProfile extends Match {
  otherProfile: Profile;
  lastMessage?: string;
  lastTime?: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: rawMatches } = await supabase
      .from("matches")
      .select("*")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!rawMatches) { setLoading(false); return; }

    const enriched: MatchWithProfile[] = await Promise.all(
      rawMatches.map(async (m) => {
        const otherId = m.user1_id === user.id ? m.user2_id : m.user1_id;
        const { data: profile } = await supabase
          .from("profiles").select("*").eq("user_id", otherId).single();

        const { data: msgs } = await supabase
          .from("messages")
          .select("content,created_at")
          .eq("match_id", m.id)
          .order("created_at", { ascending: false })
          .limit(1);

        return {
          ...m,
          otherProfile: profile,
          lastMessage: msgs?.[0]?.content,
          lastTime: msgs?.[0]?.created_at,
        };
      })
    );

    setMatches(enriched.filter((m) => m.otherProfile));
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[#2a2a3e]">
        <h1 className="text-xl font-black text-[#e2e8f0]">Matches</h1>
        <p className="text-xs text-[#64748b]">{matches.length} conexões</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="text-6xl animate-float">💜</div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#e2e8f0]">Ainda sem matches</h3>
            <p className="text-[#64748b] text-sm mt-1">Continue deslizando no Discover!</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* New matches row */}
          <div className="px-5 py-3 border-b border-[#1a1a2e]">
            <h2 className="text-xs font-semibold text-[#64748b] uppercase mb-3">Novos Matches</h2>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {matches.slice(0, 8).map((m) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/chat/${m.id}`)}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#7c3aed] animate-pulse-glow">
                    <Image
                      src={m.otherProfile.avatar_url ?? getAvatarUrl(m.otherProfile.name, m.otherProfile.user_id)}
                      alt={m.otherProfile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-[#94a3b8] font-medium max-w-[60px] truncate">
                    {m.otherProfile.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="px-5 py-3">
            <h2 className="text-xs font-semibold text-[#64748b] uppercase mb-3">Mensagens</h2>
            <div className="flex flex-col gap-1">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => router.push(`/chat/${m.id}`)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#16162a] transition-all text-left"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={m.otherProfile.avatar_url ?? getAvatarUrl(m.otherProfile.name, m.otherProfile.user_id)}
                      alt={m.otherProfile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#e2e8f0] text-sm">{m.otherProfile.name}</span>
                      {m.lastTime && (
                        <span className="text-[10px] text-[#475569]">{formatTimeAgo(m.lastTime)}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b] truncate mt-0.5">
                      {m.lastMessage ?? (
                        <span className="flex items-center gap-1">
                          <Heart size={10} className="text-[#7c3aed]" /> Vocês deram match!
                        </span>
                      )}
                    </p>
                  </div>
                  <MessageCircle size={16} className="text-[#2a2a3e] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
