"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white" aria-hidden>
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
              className={`whitespace-nowrap py-1 ${
                l.active
                  ? "border-b-2 border-indigo-600 font-medium text-slate-900"
                  : "border-b-2 border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <Link href="/meetings/new" className={`${btn.primary} !px-3 !py-1.5 whitespace-nowrap`}>
        New meeting
      </Link>
    </nav>
  );
}
