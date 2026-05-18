"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Heart, MessageCircle, User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/discover", icon: Gamepad2, label: "Discover" },
  { href: "/matches", icon: Heart, label: "Matches" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Perfil" },
  { href: "/premium", icon: Crown, label: "Premium", premium: true },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#12121f] border-t border-[#2a2a3e] safe-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label, premium }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200",
                active
                  ? premium
                    ? "text-[#f59e0b]"
                    : "text-[#7c3aed]"
                  : "text-[#475569] hover:text-[#94a3b8]"
              )}
            >
              <Icon
                size={22}
                className={cn(
                  active && !premium && "drop-shadow-[0_0_8px_#7c3aed]",
                  active && premium && "drop-shadow-[0_0_8px_#f59e0b]"
                )}
              />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span
                  className={cn(
                    "w-1 h-1 rounded-full",
                    premium ? "bg-[#f59e0b]" : "bg-[#7c3aed]"
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
