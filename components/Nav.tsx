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
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-baseline gap-1.5 font-display text-xl font-semibold tracking-tight">
          <span aria-hidden className="inline-block h-2.5 w-2.5 -translate-y-px bg-accent" />
          <span className="hidden sm:inline">Followthrough</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 py-0.5 transition ${
                l.active ? "border-accent font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <StreakBadge />
        <Link href="/meetings/new" className={`${btn.primary} !px-3.5 !py-1.5 whitespace-nowrap`}>
          New meeting
        </Link>
      </div>
    </nav>
  );
}
