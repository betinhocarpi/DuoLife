export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#090910] flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="text-6xl">📡</div>
      <h1 className="text-2xl font-black text-[#e2e8f0]">Sem conexão</h1>
      <p className="text-[#64748b]">Verifique sua internet e tente novamente.</p>
    </div>
  );
}
