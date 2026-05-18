import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gamer flex flex-col">
      <header className="px-6 py-4 border-b border-[#2a2a3e]">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Gamepad2 size={24} className="text-[#7c3aed] drop-shadow-[0_0_8px_#7c3aed]" />
          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
            DuoLife
          </span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
