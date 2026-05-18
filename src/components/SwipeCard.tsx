"use client";
import { useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Gamepad2, Star } from "lucide-react";
import { getAvatarUrl } from "@/lib/utils";
import { INTERESTS } from "@/lib/interests";
import type { Profile } from "@/types";

interface SwipeCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
  onViewProfile: () => void;
  isFront: boolean;
  stackIndex: number;
}

export function SwipeCard({ profile, onLike, onPass, onViewProfile, isFront, stackIndex }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const dragStart = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  const handleDragStart = (_: unknown, info: { point: { x: number; y: number } }) => {
    dragStart.current = { x: info.point.x, y: info.point.y };
    didDrag.current = false;
  };

  const handleDrag = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (Math.abs(info.offset.x) > 8 || Math.abs(info.offset.y) > 8) {
      didDrag.current = true;
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) onLike();
    else if (info.offset.x < -100) onPass();
  };

  const handleTap = () => {
    if (!didDrag.current && isFront) onViewProfile();
  };

  const avatar = profile.avatar_url ?? getAvatarUrl(profile.name, profile.user_id);

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: 10 - stackIndex,
        scale: isFront ? 1 : 1 - stackIndex * 0.04,
        y: isFront ? 0 : stackIndex * 8,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      className="absolute inset-0 no-select cursor-grab active:cursor-grabbing"
      whileDrag={{ cursor: "grabbing" }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-card-gamer border border-[#2a2a3e] shadow-2xl">
        {/* Avatar / Photo */}
        <div className="relative w-full h-[65%]">
          <Image
            src={avatar}
            alt={profile.name}
            fill
            className="object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090910] via-transparent to-transparent" />

          {/* Like/Nope indicators */}
          {isFront && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-6 left-6 rotate-[-20deg] border-4 border-[#10b981] rounded-xl px-4 py-2"
              >
                <span className="text-[#10b981] font-black text-2xl tracking-wider">LIKE</span>
              </motion.div>
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-6 right-6 rotate-[20deg] border-4 border-[#ef4444] rounded-xl px-4 py-2"
              >
                <span className="text-[#ef4444] font-black text-2xl tracking-wider">NOPE</span>
              </motion.div>
            </>
          )}

          {/* Premium badge */}
          {profile.is_premium && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full px-3 py-1 flex items-center gap-1">
              <Star size={12} className="text-white fill-white" />
              <span className="text-white text-xs font-bold">GOLD</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-white leading-tight">
                {profile.name}, {profile.age}
              </h2>
              {profile.location && (
                <div className="flex items-center gap-1 text-[#94a3b8] text-sm">
                  <MapPin size={12} />
                  {profile.location}
                </div>
              )}
            </div>
            {profile.rank && (
              <div className="bg-[#7c3aed20] border border-[#7c3aed] rounded-lg px-2 py-1">
                <span className="text-[#a78bfa] text-xs font-semibold">{profile.rank}</span>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-[#94a3b8] text-sm leading-relaxed line-clamp-2">{profile.bio}</p>
          )}

          {/* Games */}
          {profile.games && profile.games.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.games.slice(0, 4).map((game) => (
                <span
                  key={game.id}
                  className="flex items-center gap-1 bg-[#16162a] border border-[#2a2a3e] rounded-full px-2.5 py-1 text-xs text-[#94a3b8]"
                >
                  {game.icon} {game.name}
                </span>
              ))}
              {profile.games.length > 4 && (
                <span className="flex items-center gap-1 bg-[#16162a] border border-[#2a2a3e] rounded-full px-2.5 py-1 text-xs text-[#64748b]">
                  +{profile.games.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Platforms */}
          {profile.platforms && profile.platforms.length > 0 && (
            <div className="flex items-center gap-2">
              <Gamepad2 size={14} className="text-[#7c3aed]" />
              <span className="text-xs text-[#64748b]">{profile.platforms.join(" · ")}</span>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.slice(0, 5).map((id) => {
                const interest = INTERESTS.find((i) => i.id === id);
                if (!interest) return null;
                return (
                  <span
                    key={id}
                    className="flex items-center gap-1 bg-[#7c3aed15] border border-[#7c3aed30] rounded-full px-2.5 py-1 text-[10px] text-[#a78bfa]"
                  >
                    {interest.icon} {interest.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
