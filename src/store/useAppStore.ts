"use client";
import { create } from "zustand";
import type { Profile, Match, Message } from "@/types";

interface AppState {
  currentUser: Profile | null;
  matches: Match[];
  activeMatchId: string | null;
  messages: Record<string, Message[]>;
  setCurrentUser: (user: Profile | null) => void;
  setMatches: (matches: Match[]) => void;
  setActiveMatch: (id: string | null) => void;
  addMessage: (matchId: string, message: Message) => void;
  setMessages: (matchId: string, messages: Message[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  matches: [],
  activeMatchId: null,
  messages: {},
  setCurrentUser: (user) => set({ currentUser: user }),
  setMatches: (matches) => set({ matches }),
  setActiveMatch: (id) => set({ activeMatchId: id }),
  addMessage: (matchId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [matchId]: [...(state.messages[matchId] ?? []), message],
      },
    })),
  setMessages: (matchId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [matchId]: messages },
    })),
}));
