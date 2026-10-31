import type { Metadata } from "next";
import { Caveat, Fraunces, Instrument_Sans } from "next/font/google";
import BackgroundFX from "@/components/BackgroundFX";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Followthrough",
  description: "Turn meeting recaps into decisions, owners and deadlines, and catch contradictions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${hand.variable}`}>
      <body className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased">
        <BackgroundFX />
        <header className="sticky top-0 z-30 border-b border-ink/15 bg-paper">
          <Nav />
        </header>
        <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:py-12">{children}</main>
        <footer className="relative z-10 mx-auto max-w-6xl border-t border-rule px-4 py-6 text-sm text-muted">
          Built by voice with Wispr Flow for the Agentic AI Hackathon. Photos by Vitaly Gariev, Andrik
          Langfield and Vadim Bozhko on{" "}
          <a className="underline hover:text-ink" href="https://unsplash.com" target="_blank" rel="noreferrer">
            Unsplash
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
