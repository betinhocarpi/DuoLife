"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getAvatarUrl, formatTimeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Send, Gamepad2 } from "lucide-react";
import type { Message, Profile } from "@/types";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [myId, setMyId] = useState<string>("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function init() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setMyId(user.id);

    const { data: match } = await supabase
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();

    if (!match) return;

    const otherId = match.user1_id === user.id ? match.user2_id : match.user1_id;
    const { data: profile } = await supabase
      .from("profiles").select("*").eq("user_id", otherId).single();

    if (profile) setOtherProfile(profile);

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", id)
      .order("created_at");

    if (msgs) setMessages(msgs);

    // Realtime subscription
    supabase
      .channel(`chat-${id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `match_id=eq.${id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();
  }

  async function sendMessage() {
    if (!text.trim() || loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("messages").insert({
      match_id: id,
      sender_id: myId,
      content: text.trim(),
    });
    setText("");
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a3e] bg-[#12121f]">
        <button onClick={() => router.back()} className="text-[#64748b] hover:text-[#e2e8f0] p-1">
          <ArrowLeft size={20} />
        </button>
        {otherProfile && (
          <>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#7c3aed]">
              <Image
                src={otherProfile.avatar_url ?? getAvatarUrl(otherProfile.name, otherProfile.user_id)}
                alt={otherProfile.name}
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#e2e8f0]">{otherProfile.name}</p>
              <div className="flex items-center gap-1">
                <Gamepad2 size={10} className="text-[#7c3aed]" />
                <p className="text-[10px] text-[#64748b]">
                  {otherProfile.games?.slice(0, 2).map((g) => g.name).join(", ")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-10">
            <div className="text-4xl">💬</div>
            <p className="text-[#64748b] text-sm">Comece a conversa! Digam os jogos favoritos e marquem uma sessão.</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === myId;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isMine
                  ? "bg-[#7c3aed] text-white rounded-br-sm"
                  : "bg-[#16162a] text-[#e2e8f0] border border-[#2a2a3e] rounded-bl-sm"
              }`}>
                {msg.content}
                <div className={`text-[10px] mt-1 ${isMine ? "text-[#c4b5fd]" : "text-[#475569]"}`}>
                  {formatTimeAgo(msg.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#2a2a3e] bg-[#12121f] flex gap-2 items-end">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Mensagem..."
          className="flex-1 bg-[#16162a] border border-[#2a2a3e] rounded-2xl px-4 py-3 text-sm text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:border-[#7c3aed] resize-none"
        />
        <Button
          onClick={sendMessage}
          loading={loading}
          disabled={!text.trim()}
          className="rounded-2xl px-4 py-3 h-auto"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
