"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBasket, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cartCount, useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/", label: "Domů" },
  { href: "/vejce", label: "Naše vejce" },
  { href: "/farma", label: "Naše farma" },
  { href: "/vydejni-mista", label: "Výdejní místa" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe mounted flag
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- closes mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const count = mounted ? cartCount(items) : 0;
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-[0_2px_20px_rgba(60,44,28,0.08)]"
          : "bg-transparent"
      )}
    >
      <div className="container-farm flex h-20 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-cream shadow-sm transition-transform group-hover:-rotate-6">
            <svg viewBox="0 0 24 24" className="h-5 w-6" fill="currentColor">
              <ellipse cx="12" cy="13" rx="7" ry="9" />
            </svg>
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-brown-900">
            Vajčo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium text-brown-900/80 transition-colors hover:text-green-700",
                  active && "text-green-700"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-egg-yolk" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCart}
            aria-label="Otevřít košík"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-brown-300/50 bg-cream/60 text-brown-900 transition-colors hover:bg-green-600 hover:text-cream hover:border-green-600"
          >
            <ShoppingBasket className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-egg-yolk px-1 text-[11px] font-bold text-brown-900"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Otevřít menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-brown-900 md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-brown-300/30 bg-cream md:hidden"
          >
            <div className="container-farm flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-3 py-3 text-base font-medium text-brown-900 transition-colors hover:bg-green-50",
                    pathname === link.href && "bg-green-50 text-green-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
