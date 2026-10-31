"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StreakBadge from "@/components/StreakBadge";
import { btn } from "@/lib/ui";

export default function Nav() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home", active: pathname === "/" },
    {
      href: "/meetings",
      label: "Meetings",
      active: pathname.startsWith("/meetings") && pathname !== "/meetings/new",
    },
    { href: "/digest", label: "Digest", active: pathname === "/digest" },
  ];
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-white">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/40"
            aria-hidden
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden sm:inline">Followthrough</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 py-1 transition ${
                l.active
                  ? "border-indigo-400 font-medium text-white"
                  : "border-transparent text-slate-300 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StreakBadge />
        <Link href="/meetings/new" className={`${btn.primary} !px-3.5 !py-1.5 whitespace-nowrap`}>
          New meeting
        </Link>
      </div>
    </nav>
  );
}
