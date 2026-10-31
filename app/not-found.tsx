import Link from "next/link";
import { btn } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="space-y-3 py-16 text-center">
      <h1 className="text-2xl font-bold text-white">We couldn’t find that page</h1>
      <p className="text-sm text-slate-300">
        The meeting may have been removed (for example by “Reset demo data”).
      </p>
      <Link href="/meetings" className={`${btn.primary} mt-2`}>
        Back to meetings
      </Link>
    </div>
  );
}
