"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getAvatarUrl } from "@/lib/utils";
import { GameSelector } from "@/components/GameSelector";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogOut, Edit3, Save, Gamepad2, MapPin, MessageSquare, Star } from "lucide-react";
import type { Profile, Game, Platform, PlayStyle } from "@/types";

const PLATFORMS: Platform[] = ["PC", "PS5", "Xbox", "Switch", "Mobile"];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [discord, setDiscord] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [playStyle, setPlayStyle] = useState<PlayStyle>("Ambos");
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    if (data) {
      setProfile(data);
      setName(data.name);
      setBio(data.bio ?? "");
      setLocation(data.location ?? "");
      setDiscord(data.discord ?? "");
      setPlatforms(data.platforms ?? []);
      setPlayStyle(data.play_style ?? "Ambos");
      setGames(data.games ?? []);
    }
  }

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({
      name, bio, location, discord, platforms, play_style: playStyle, games,
    }).eq("id", profile.id);
    await loadProfile();
    setSaving(false);
    setEditing(false);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!profile) return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const avatar = profile.avatar_url ?? getAvatarUrl(profile.name, profile.user_id);

  return (
    <div className="flex flex-col h-full overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-[#7c3aed] to-[#06b6d4]" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="w-9 h-9 rounded-full bg-[#090910]/60 backdrop-blur flex items-center justify-center text-[#e2e8f0]"
          >
            {editing ? <Save size={16} /> : <Edit3 size={16} />}
          </button>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-full bg-[#090910]/60 backdrop-blur flex items-center justify-center text-[#64748b]"
          >
            <LogOut size={16} />
          </button>
        </div>
        <div className="px-5 pb-4">
          <div className="relative -mt-12 w-24 h-24 rounded-full border-4 border-[#090910] overflow-hidden">
            <Image src={avatar} alt={profile.name} fill className="object-cover" />
          </div>
          {profile.is_premium && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="text-[#f59e0b] fill-[#f59e0b]" />
              <span className="text-xs text-[#f59e0b] font-semibold">DuoLife Gold</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-24 flex flex-col gap-5">
        {editing ? (
          <>
            <Input label="Nome / Nick" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#94a3b8]">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full bg-[#16162a] border border-[#2a2a3e] rounded-xl px-4 py-3 text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:border-[#7c3aed] resize-none text-sm"
              />
            </div>
            <Input label="Localização" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin size={16} />} />
            <Input label="Discord" value={discord} onChange={(e) => setDiscord(e.target.value)} icon={<MessageSquare size={16} />} />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#94a3b8]">Plataformas</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      platforms.includes(p) ? "bg-[#7c3aed20] border-[#7c3aed] text-[#a78bfa]" : "bg-[#16162a] border-[#2a2a3e] text-[#64748b]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#94a3b8]">Jogos</label>
              <GameSelector selected={games} onChange={setGames} />
            </div>

            <Button onClick={saveProfile} loading={saving} size="lg" className="w-full">
              <Save size={18} /> Salvar perfil
            </Button>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-black text-[#e2e8f0]">{profile.name}, {profile.age}</h1>
              {profile.location && (
                <div className="flex items-center gap-1 text-[#64748b] text-sm mt-1">
                  <MapPin size={12} /> {profile.location}
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="text-[#94a3b8] text-sm leading-relaxed">{profile.bio}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Gamepad2 size={14} className="text-[#7c3aed]" />, label: "Plataformas", val: profile.platforms?.join(", ") || "–" },
                { icon: <Star size={14} className="text-[#f59e0b]" />, label: "Estilo", val: profile.play_style || "–" },
              ].map(({ icon, label, val }) => (
                <div key={label} className="bg-[#16162a] border border-[#2a2a3e] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-[#64748b]">{label}</span></div>
                  <span className="text-sm font-semibold text-[#e2e8f0]">{val}</span>
                </div>
              ))}
            </div>

            {profile.games?.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-[#94a3b8]">Jogos</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.games.map((g) => (
                    <span key={g.id} className="flex items-center gap-1.5 bg-[#7c3aed20] border border-[#7c3aed40] text-[#a78bfa] px-3 py-1 rounded-full text-xs">
                      {g.icon} {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.discord && (
              <div className="flex items-center gap-2 bg-[#16162a] border border-[#2a2a3e] rounded-xl p-3">
                <MessageSquare size={16} className="text-[#7c3aed]" />
                <span className="text-sm text-[#94a3b8]">Discord:</span>
                <span className="text-sm font-semibold text-[#e2e8f0]">{profile.discord}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
