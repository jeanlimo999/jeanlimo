export default function DispatchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F1E8]">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0B0C]/95 px-4 py-3">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-2">
          <a href="/dispatch" className="text-[13px] tracking-[0.16em] text-[#E8D3B0]">JEAN LIMO DISPATCH</a>
          <div className="flex gap-2">
            <a href="/dispatch/send" className="rounded-full border border-[#C4A574]/40 px-3 py-1 text-xs text-[#E8D3B0]">Send</a>
            <a href="/dispatch/inbox" className="rounded-full border border-[#C4A574]/40 px-3 py-1 text-xs text-[#E8D3B0]">Inbox</a>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
