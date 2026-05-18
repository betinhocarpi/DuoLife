export type Platform = "PC" | "PS5" | "Xbox" | "Switch" | "Mobile";
export type PlayStyle = "Casual" | "Competitivo" | "Ambos";
export type Gender = "Homem" | "Mulher" | "Não-binário" | "Prefiro não dizer";
export type LookingFor = "Duo de game" | "Amizade" | "Relacionamento" | "Qualquer coisa";

export interface Game {
  id: string;
  name: string;
  category: string;
  icon: string;
  cover_url?: string;
  rank?: number;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  bio: string;
  avatar_url: string | null;
  photos: string[];
  location: string | null;
  platforms: Platform[];
  games: Game[];
  play_style: PlayStyle;
  gender: Gender;
  looking_for: LookingFor[];
  rank: string | null;
  discord: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  profile?: Profile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  liked: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "basic" | "gold" | "platinum";
  status: "active" | "cancelled" | "expired";
  expires_at: string;
}
