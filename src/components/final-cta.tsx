import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="container-farm pb-20 md:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-green-700 px-8 py-16 text-center md:py-20">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-green-600/50 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-egg-yolk/20 blur-3xl" />
          <h2 className="relative text-balance font-display text-3xl font-semibold text-cream md:text-4xl">
            Připraveni na opravdu čerstvá vejce?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-balance text-green-50/85">
            Vyberte si vejce, zvolte výdejní místo a termín — objednávka
            zabere jen pár minut.
          </p>
          <Link
            href="/vejce"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-egg-yolk px-8 py-4 text-sm font-semibold text-brown-900 shadow-lg transition-transform hover:scale-105"
          >
            Objednat vejce
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
