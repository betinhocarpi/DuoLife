"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/utils";

interface MatchModalProps {
  isOpen: boolean;
  myAvatar?: string | null;
  matchName: string;
  matchAvatar?: string | null;
  matchId: string;
  onClose: () => void;
  onChat: () => void;
}

export function MatchModal({ isOpen, myAvatar, matchName, matchAvatar, onClose, onChat }: MatchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "radial-gradient(ellipse at center, #16062a 0%, #090910 100%)" }}
        >
          {/* Particle effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#7c3aed] rounded-full"
                initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex flex-col items-center gap-6 text-center relative z-10"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] glow-text-purple"
            >
              IT&apos;S A MATCH!
            </motion.div>

            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-full border-4 border-[#7c3aed] overflow-hidden glow-purple">
                <Image
                  src={myAvatar ?? getAvatarUrl("me")}
                  alt="Você"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl"
              >
                💜
              </motion.div>
              <div className="w-28 h-28 rounded-full border-4 border-[#06b6d4] overflow-hidden glow-cyan">
                <Image
                  src={matchAvatar ?? getAvatarUrl(matchName)}
                  alt={matchName}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-[#94a3b8] text-lg">
              Você e <span className="text-[#e2e8f0] font-semibold">{matchName}</span> deram match!
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button onClick={onChat} size="lg" className="w-full gap-2">
                <MessageCircle size={20} /> Mandar mensagem
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full gap-2">
                <X size={18} /> Continuar explorando
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
