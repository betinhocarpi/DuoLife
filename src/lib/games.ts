import type { Game } from "@/types";

export const GAMES: Game[] = [
  { id: "lol", name: "League of Legends", category: "MOBA", icon: "⚔️" },
  { id: "valorant", name: "Valorant", category: "FPS", icon: "🔫" },
  { id: "cs2", name: "CS2", category: "FPS", icon: "💣" },
  { id: "apex", name: "Apex Legends", category: "Battle Royale", icon: "🎯" },
  { id: "fortnite", name: "Fortnite", category: "Battle Royale", icon: "🏗️" },
  { id: "warzone", name: "Call of Duty: Warzone", category: "Battle Royale", icon: "🪖" },
  { id: "ow2", name: "Overwatch 2", category: "FPS", icon: "🦸" },
  { id: "r6", name: "Rainbow Six Siege", category: "FPS", icon: "🛡️" },
  { id: "dota2", name: "Dota 2", category: "MOBA", icon: "🗡️" },
  { id: "wow", name: "World of Warcraft", category: "MMO", icon: "🧙" },
  { id: "ffxiv", name: "Final Fantasy XIV", category: "MMO", icon: "🌟" },
  { id: "minecraft", name: "Minecraft", category: "Sandbox", icon: "⛏️" },
  { id: "gtav", name: "GTA Online", category: "Open World", icon: "🚗" },
  { id: "eafc", name: "EA FC 25", category: "Sports", icon: "⚽" },
  { id: "rocket", name: "Rocket League", category: "Sports", icon: "🚀" },
  { id: "genshin", name: "Genshin Impact", category: "RPG", icon: "🌸" },
  { id: "diablo", name: "Diablo IV", category: "RPG", icon: "😈" },
  { id: "poe", name: "Path of Exile", category: "RPG", icon: "💀" },
  { id: "elden", name: "Elden Ring", category: "Action RPG", icon: "💍" },
  { id: "pubg", name: "PUBG", category: "Battle Royale", icon: "🎪" },
  { id: "mlbb", name: "Mobile Legends", category: "MOBA Mobile", icon: "📱" },
  { id: "freefire", name: "Free Fire", category: "Battle Royale Mobile", icon: "🔥" },
  { id: "clash", name: "Clash of Clans", category: "Strategy Mobile", icon: "🏰" },
  { id: "pokemon", name: "Pokémon GO", category: "AR Mobile", icon: "🎮" },
  { id: "stardew", name: "Stardew Valley", category: "Simulation", icon: "🌾" },
  { id: "among", name: "Among Us", category: "Social", icon: "🚀" },
  { id: "lost_ark", name: "Lost Ark", category: "MMO", icon: "⚓" },
  { id: "destiny2", name: "Destiny 2", category: "FPS/RPG", icon: "🌌" },
  { id: "hades", name: "Hades II", category: "Roguelike", icon: "🔱" },
  { id: "tarkov", name: "Escape from Tarkov", category: "FPS", icon: "🎒" },
];

export const GAME_CATEGORIES = [...new Set(GAMES.map((g) => g.category))].sort();

export function getGamesByCategory(category: string): Game[] {
  return GAMES.filter((g) => g.category === category);
}

export function getGameById(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}
