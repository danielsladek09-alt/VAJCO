import { Egg, Feather, PackageCheck, Sprout, Truck } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: Feather,
    title: "Volný chov",
    text: "Slepice žijí v přirozeném prostředí s denním přístupem do výběhu.",
  },
  {
    icon: Sprout,
    title: "Přirozená strava",
    text: "Dostávají kvalitní a pestré krmivo doplněné o to, co si samy najdou venku.",
  },
  {
    icon: Egg,
    title: "Sběr vajec",
    text: "Čerstvá vejce se sbírají ručně, každý den ve stejnou dobu.",
  },
  {
    icon: PackageCheck,
    title: "Příprava objednávky",
    text: "Vejce roztřídíme, zkontrolujeme a připravíme přesně podle objednávek.",
  },
  {
    icon: Truck,
    title: "Výdej",
    text: "Objednávku si jednoduše vyzvednete na zvoleném výdejním místě.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-green-50/60 py-16 md:py-24">
      <div className="container-farm">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Jak to funguje
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brown-900 md:text-4xl">
            Od slepice až k vám
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-4">
          <div className="absolute left-0 right-0 top-8 hidden h-[2px] bg-gradient-to-r from-transparent via-brown-300/60 to-transparent md:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-50 bg-green-600 text-cream shadow-md">
                  <step.icon className="h-7 w-7" strokeWidth={1.6} />
                </div>
                <span className="mt-4 font-display text-2xl font-semibold text-egg-yolk-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-brown-900">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-brown-700/70">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
