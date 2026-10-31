import type { Metadata } from "next";
import BackgroundFX from "@/components/BackgroundFX";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Followthrough",
  description: "Turn meeting recaps into decisions, owners and deadlines, and catch contradictions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-clip bg-[#060a18] font-sans text-slate-100 antialiased">
        <BackgroundFX />
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060a18]/60 backdrop-blur-xl">
          <Nav />
        </header>
        <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:py-12">{children}</main>
        <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-4 text-center text-xs text-slate-400">
          Built by voice with Wispr Flow for the Agentic AI Hackathon · Photos by Vitaly Gariev, Andrik
          Langfield and Vadim Bozhko on{" "}
          <a className="underline hover:text-white" href="https://unsplash.com" target="_blank" rel="noreferrer">
            Unsplash
          </a>
        </footer>
      </body>
    </html>
  );
}
