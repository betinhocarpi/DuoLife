"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SwipeStack } from "@/components/SwipeStack";
import { MatchModal } from "@/components/MatchModal";
import { createClient } from "@/lib/supabase/client";
import { Gamepad2, Settings } from "lucide-react";
import type { Profile } from "@/types";

// Demo profiles shown when no Supabase profiles available
const DEMO_PROFILES: Profile[] = [
  {
    id: "demo1", user_id: "demo1", name: "Kami", age: 23,
    bio: "Suporte main, amo jogar com pessoas que comunicam bem. Bora rankar?",
    avatar_url: null, photos: [], location: "São Paulo",
    platforms: ["PC"], play_style: "Competitivo", gender: "Mulher",
    looking_for: ["Duo de game", "Relacionamento"], rank: "Diamond II", discord: "kami#1234",
    is_premium: true, created_at: "", updated_at: "",
    games: [
      { id: "lol", name: "League of Legends", category: "MOBA", icon: "⚔️" },
      { id: "valorant", name: "Valorant", category: "FPS", icon: "🔫" },
    ],
  },
  {
    id: "demo2", user_id: "demo2", name: "NovaX", age: 25,
    bio: "Streamer casual, jogo tudo. Adoro conhecer novas pessoas pelo game.",
    avatar_url: null, photos: [], location: "Rio de Janeiro",
    platforms: ["PC", "PS5"], play_style: "Ambos", gender: "Homem",
    looking_for: ["Duo de game", "Amizade", "Qualquer coisa"], rank: "Platinum", discord: "novax#5678",
    is_premium: false, created_at: "", updated_at: "",
    games: [
      { id: "apex", name: "Apex Legends", category: "Battle Royale", icon: "🎯" },
      { id: "fortnite", name: "Fortnite", category: "Battle Royale", icon: "🏗️" },
      { id: "genshin", name: "Genshin Impact", category: "RPG", icon: "🌸" },
    ],
  },
  {
    id: "demo3", user_id: "demo3", name: "Yuki", age: 21,
    bio: "Healer main em FFXIV. Casual gamer em busca de aventuras.",
    avatar_url: null, photos: [], location: "Curitiba",
    platforms: ["PC", "Switch"], play_style: "Casual", gender: "Não-binário",
    looking_for: ["Amizade", "Relacionamento"], rank: null, discord: "yuki#9012",
    is_premium: false, created_at: "", updated_at: "",
    games: [
      { id: "ffxiv", name: "Final Fantasy XIV", category: "MMO", icon: "🌟" },
      { id: "stardew", name: "Stardew Valley", category: "Simulation", icon: "🌾" },
    ],
  },
  {
    id: "demo4", user_id: "demo4", name: "DarkByte", age: 27,
    bio: "CS2 faceit 10. Jogo sério mas sem drama. Bora ganhar?",
    avatar_url: null, photos: [], location: "Belo Horizonte",
    platforms: ["PC"], play_style: "Competitivo", gender: "Homem",
    looking_for: ["Duo de game"], rank: "FACEIT 10", discord: "darkbyte#3456",
    is_premium: true, created_at: "", updated_at: "",
    games: [
      { id: "cs2", name: "CS2", category: "FPS", icon: "💣" },
      { id: "tarkov", name: "Escape from Tarkov", category: "FPS", icon: "🎒" },
    ],
  },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>(DEMO_PROFILES);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [matchProfile, setMatchProfile] = useState<Profile | null>(null);
  const [matchId, setMatchId] = useState("");

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: myProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (myProfile) setCurrentUser(myProfile);

    const { data: swipedIds } = await supabase
      .from("swipes")
      .select("swiped_id")
      .eq("swiper_id", user.id);

    const excluded = [user.id, ...(swipedIds?.map((s) => s.swiped_id) ?? [])];

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .not("user_id", "in", `(${excluded.join(",")})`)
      .limit(20);

    if (data && data.length > 0) setProfiles(data);
  }

  const handleLike = async (profile: Profile): Promise<boolean> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    await supabase.from("swipes").insert({
      swiper_id: user.id,
      swiped_id: profile.user_id,
      liked: true,
    });

    const { data: match } = await supabase
      .from("matches")
      .select("id")
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${profile.user_id}),and(user1_id.eq.${profile.user_id},user2_id.eq.${user.id})`)
      .single();

    if (match) {
      setMatchProfile(profile);
      setMatchId(match.id);
      return true;
    }
    return false;
  };

  const handlePass = async (profile: Profile) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("swipes").insert({
      swiper_id: user.id,
      swiped_id: profile.user_id,
      liked: false,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-2">
          <Gamepad2 size={22} className="text-[#7c3aed] drop-shadow-[0_0_6px_#7c3aed]" />
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
            DuoLife
          </span>
        </div>
        <button className="text-[#64748b] hover:text-[#e2e8f0] transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Swipe Stack */}
      <div className="flex-1 overflow-hidden py-3">
        <SwipeStack
          profiles={profiles}
          onLike={handleLike}
          onPass={handlePass}
          onSuperLike={() => {}}
          isPremium={currentUser?.is_premium}
        />
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={!!matchProfile}
        myAvatar={currentUser?.avatar_url}
        matchName={matchProfile?.name ?? ""}
        matchAvatar={matchProfile?.avatar_url}
        matchId={matchId}
        onClose={() => setMatchProfile(null)}
        onChat={() => { router.push(`/chat/${matchId}`); setMatchProfile(null); }}
      />
    </div>
  );
}
