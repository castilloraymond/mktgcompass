import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { DemoBanner } from "@/components/layout/DemoBanner";

export const metadata: Metadata = {
  title: "MktgCompass — AI Marketing Mix Modeling",
  description: "Free, AI-powered Marketing Mix Modeling for non-technical marketers. Upload your data, get channel ROI and budget recommendations in minutes.",
  openGraph: {
    title: "MktgCompass",
    description: "AI-powered Marketing Mix Modeling made simple.",
    url: "https://mktgcompass.com",
    siteName: "MktgCompass",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoBanner />
        <div className="flex h-[calc(100vh-40px)]">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <TopBar />
            <main className="flex-1 overflow-y-auto px-8 py-6">
              {children}
            </main>
          </div>
          <ChatPanel />
        </div>
      </body>
    </html>
  );
}
