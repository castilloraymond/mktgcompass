import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { DemoBanner } from "@/components/layout/DemoBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 bg-surface">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-8 py-8">
            {children}
          </main>
        </div>
        <ChatPanel />
      </div>
    </>
  );
}
