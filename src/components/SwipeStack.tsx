"use client";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/Button";
import { X, Heart, Star } from "lucide-react";
import type { Profile } from "@/types";

interface SwipeStackProps {
  profiles: Profile[];
  onLike: (profile: Profile) => Promise<boolean>; // returns true if match
  onPass: (profile: Profile) => void;
  onSuperLike?: (profile: Profile) => void;
  onEmpty?: () => void;
  isPremium?: boolean;
}

export function SwipeStack({ profiles, onLike, onPass, onSuperLike, onEmpty, isPremium }: SwipeStackProps) {
  const [queue, setQueue] = useState<Profile[]>(profiles);
  const [gone, setGone] = useState<Set<string>>(new Set());

  const handleLike = useCallback(async (profile: Profile) => {
    setGone((prev) => new Set(prev).add(profile.id));
    setTimeout(() => setQueue((prev) => prev.filter((p) => p.id !== profile.id)), 300);
    const isMatch = await onLike(profile);
    if (queue.length <= 1) onEmpty?.();
    return isMatch;
  }, [onLike, onEmpty, queue.length]);

  const handlePass = useCallback((profile: Profile) => {
    setGone((prev) => new Set(prev).add(profile.id));
    setTimeout(() => setQueue((prev) => prev.filter((p) => p.id !== profile.id)), 300);
    onPass(profile);
    if (queue.length <= 1) onEmpty?.();
  }, [onPass, onEmpty, queue.length]);

  const visible = queue.slice(0, 3);
  const front = visible[0];

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
        <div className="text-6xl animate-float">😴</div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#e2e8f0]">Por enquanto é só!</h3>
          <p className="text-[#64748b] text-sm mt-1">Volta mais tarde para ver novos perfis.</p>
        </div>
        <Button onClick={() => { setQueue(profiles); setGone(new Set()); }} variant="outline">
          Recarregar perfis
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Cards */}
      <div className="relative flex-1 mx-4">
        <AnimatePresence>
          {visible.map((profile, i) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: gone.has(profile.id) ? 0 : 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <SwipeCard
                profile={profile}
                isFront={i === 0}
                stackIndex={i}
                onLike={() => handleLike(profile)}
                onPass={() => handlePass(profile)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      {front && (
        <div className="flex items-center justify-center gap-4 pb-2 px-6">
          <button
            onClick={() => handlePass(front)}
            className="w-14 h-14 rounded-full bg-[#16162a] border-2 border-[#ef4444] flex items-center justify-center text-[#ef4444] hover:bg-[#ef444420] transition-all active:scale-90 shadow-lg"
          >
            <X size={24} />
          </button>

          {onSuperLike && (
            <button
              onClick={() => {
                if (!isPremium) return;
                onSuperLike(front);
                handlePass(front);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                isPremium
                  ? "bg-[#16162a] border-2 border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d420]"
                  : "bg-[#16162a] border-2 border-[#2a2a3e] text-[#2a2a3e] cursor-not-allowed"
              }`}
              title={isPremium ? "Super Like" : "Recurso Premium"}
            >
              <Star size={20} />
            </button>
          )}

          <button
            onClick={() => handleLike(front)}
            className="w-14 h-14 rounded-full bg-[#16162a] border-2 border-[#10b981] flex items-center justify-center text-[#10b981] hover:bg-[#10b98120] transition-all active:scale-90 shadow-lg"
          >
            <Heart size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
