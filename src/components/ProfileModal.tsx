"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Heart, MapPin, Gamepad2, Star, MessageCircle, Swords } from "lucide-react";
import { getAvatarUrl } from "@/lib/utils";
import { INTERESTS } from "@/lib/interests";
import type { Profile } from "@/types";

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  PC: "🖥️", PS5: "🎮", Xbox: "🕹️", Switch: "💜", Mobile: "📱",
};

const LOOKING_FOR_ICONS: Record<string, string> = {
  "Duo de game": "🎯", "Amizade": "🤝", "Relacionamento": "❤️", "Qualquer coisa": "✨",
};

export function ProfileModal({ profile, onClose, onLike, onPass }: ProfileModalProps) {
  if (!profile) return null;

  const avatar = profile.avatar_url ?? getAvatarUrl(profile.name, profile.user_id);

  return (
    <AnimatePresence>
      {profile && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] flex flex-col rounded-t-3xl overflow-hidden bg-[#0d0d1a] border-t border-[#2a2a3e]"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#2a2a3e]" />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 pb-28">
              {/* Hero photo */}
              <div className="relative w-full aspect-[3/4]">
                <Image src={avatar} alt={profile.name} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />

                {profile.is_premium && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full px-3 py-1 flex items-center gap-1">
                    <Star size={12} className="text-white fill-white" />
                    <span className="text-white text-xs font-bold">GOLD</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-3xl font-black text-white">
                    {profile.name}, {profile.age}
                  </h2>
                  {profile.location && (
                    <div className="flex items-center gap-1.5 text-[#94a3b8] mt-1">
                      <MapPin size={14} />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pt-4 flex flex-col gap-5">
                {/* Bio */}
                {profile.bio && (
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{profile.bio}</p>
                )}

                {/* Rank & Discord row */}
                {(profile.rank || profile.discord) && (
                  <div className="flex flex-wrap gap-2">
                    {profile.rank && (
                      <div className="flex items-center gap-2 bg-[#7c3aed15] border border-[#7c3aed40] rounded-xl px-3 py-2">
                        <Swords size={14} className="text-[#a78bfa]" />
                        <span className="text-[#a78bfa] text-sm font-semibold">{profile.rank}</span>
                      </div>
                    )}
                    {profile.discord && (
                      <div className="flex items-center gap-2 bg-[#5865f220] border border-[#5865f240] rounded-xl px-3 py-2">
                        <MessageCircle size={14} className="text-[#7289da]" />
                        <span className="text-[#7289da] text-sm font-medium">{profile.discord}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Looking for */}
                {profile.looking_for && profile.looking_for.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Procurando</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.looking_for.map((l) => (
                        <span key={l} className="flex items-center gap-1.5 bg-[#f59e0b15] border border-[#f59e0b40] text-[#fbbf24] px-3 py-1.5 rounded-full text-xs font-medium">
                          {LOOKING_FOR_ICONS[l] ?? "✨"} {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Play style */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Estilo</span>
                  <span className="bg-[#06b6d420] border border-[#06b6d440] text-[#22d3ee] px-3 py-1 rounded-full text-xs font-medium">
                    {profile.play_style}
                  </span>
                </div>

                {/* Platforms */}
                {profile.platforms && profile.platforms.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Plataformas</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.platforms.map((p) => (
                        <span key={p} className="flex items-center gap-1.5 bg-[#16162a] border border-[#2a2a3e] text-[#94a3b8] px-3 py-1.5 rounded-full text-xs font-medium">
                          {PLATFORM_ICONS[p] ?? "🖥️"} {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Games */}
                {profile.games && profile.games.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
                      <Gamepad2 size={12} /> Jogos
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.games.map((game) => (
                        <span key={game.id} className="flex items-center gap-1.5 bg-[#16162a] border border-[#2a2a3e] text-[#94a3b8] px-3 py-1.5 rounded-full text-xs font-medium">
                          {game.icon} {game.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Interesses</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((id) => {
                        const interest = INTERESTS.find((i) => i.id === id);
                        if (!interest) return null;
                        return (
                          <span key={id} className="flex items-center gap-1.5 bg-[#7c3aed15] border border-[#7c3aed30] text-[#a78bfa] px-3 py-1.5 rounded-full text-xs font-medium">
                            {interest.icon} {interest.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed action buttons */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a] to-transparent">
              <div className="flex gap-3">
                <button
                  onClick={() => { onPass(); onClose(); }}
                  className="flex-1 h-14 rounded-2xl bg-[#16162a] border-2 border-[#ef4444] flex items-center justify-center gap-2 text-[#ef4444] font-bold text-sm hover:bg-[#ef444420] transition-all active:scale-95"
                >
                  <X size={20} /> Passar
                </button>
                <button
                  onClick={() => { onLike(); onClose(); }}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] flex items-center justify-center gap-2 text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-[0_0_20px_#7c3aed60]"
                >
                  <Heart size={20} /> Like
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
