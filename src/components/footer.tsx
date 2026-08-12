"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-brown-300/30 bg-brown-900 text-cream-warm">
      <div className="container-farm grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-egg-yolk text-brown-900">
              <svg viewBox="0 0 24 24" className="h-4 w-5" fill="currentColor">
                <ellipse cx="12" cy="13" rx="7" ry="9" />
              </svg>
            </span>
            <span className="font-display text-xl font-semibold">Vajčo</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-warm/70">
            Čerstvá vejce z volného chovu přímo z farmy v Krnici. Poctivě,
            přirozeně a s láskou k detailu.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg font-medium text-egg-yolk">Navigace</h3>
          <ul className="mt-4 space-y-2 text-sm text-cream-warm/80">
            <li><Link className="hover:text-egg-yolk transition-colors" href="/vejce">Naše vejce</Link></li>
            <li><Link className="hover:text-egg-yolk transition-colors" href="/farma">Naše farma</Link></li>
            <li><Link className="hover:text-egg-yolk transition-colors" href="/vydejni-mista">Výdejní místa</Link></li>
            <li><Link className="hover:text-egg-yolk transition-colors" href="/faq">Časté dotazy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-medium text-egg-yolk">Kontakt</h3>
          <ul className="mt-4 space-y-3 text-sm text-cream-warm/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-egg-yolk" />
              Farma Krnice, Jihomoravský kraj
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-egg-yolk" />
              <a href="tel:+420777123456" className="hover:text-egg-yolk transition-colors">+420 777 123 456</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-egg-yolk" />
              <a href="mailto:info@vajco.cz" className="hover:text-egg-yolk transition-colors">info@vajco.cz</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-medium text-egg-yolk">Objednávka</h3>
          <p className="mt-4 text-sm text-cream-warm/70">
            Vyberte vejce, přidejte do košíku a zvolte výdejní místo i termín.
          </p>
          <Link
            href="/vejce"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-egg-yolk px-5 py-2.5 text-sm font-semibold text-brown-900 transition-transform hover:scale-105"
          >
            Objednat vejce
          </Link>
        </div>
      </div>

      <div className="border-t border-cream-warm/10 py-5">
        <div className="container-farm flex flex-col items-center justify-between gap-2 text-xs text-cream-warm/50 md:flex-row">
          <p>© {new Date().getFullYear()} Vajčo — farma Krnice. Všechna práva vyhrazena.</p>
          <Link href="/admin" className="hover:text-egg-yolk transition-colors">
            Administrace
          </Link>
        </div>
      </div>
    </footer>
  );
}
