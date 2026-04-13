import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-raw",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-mono-raw",
});

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
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
