"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  Egg,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquareQuote,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Přehled", icon: LayoutDashboard },
  { href: "/admin/produkty", label: "Produkty", icon: Egg },
  { href: "/admin/objednavky", label: "Objednávky", icon: ShoppingBag },
  { href: "/admin/vydejni-mista", label: "Výdejní místa", icon: MapPin },
  { href: "/admin/terminy", label: "Termíny", icon: CalendarClock },
  { href: "/admin/recenze", label: "Recenze", icon: MessageSquareQuote },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-cream-warm/40">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brown-300/25 bg-white/60 p-5 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-cream">
            <svg viewBox="0 0 24 24" className="h-4 w-5" fill="currentColor">
              <ellipse cx="12" cy="13" rx="7" ry="9" />
            </svg>
          </span>
          <span className="font-display text-xl font-semibold text-brown-900">Vajčo admin</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-green-600 text-cream"
                    : "text-brown-800 hover:bg-green-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brown-700/70 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Odhlásit se
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
