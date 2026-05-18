import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#090910]">
      <div className="flex-1 overflow-hidden pb-16">{children}</div>
      <BottomNav />
    </div>
  );
}
