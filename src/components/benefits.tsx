import { Leaf, Wheat, Timer, MapPin } from "lucide-react";
import { Reveal } from "./reveal";

const BENEFITS = [
  {
    icon: Leaf,
    title: "Volný chov",
    text: "Slepice mají prostor pro přirozený pohyb a venkovní výběh po celý den.",
  },
  {
    icon: Wheat,
    title: "Přírodní krmivo",
    text: "Důraz klademe na kvalitní a přirozenou stravu bez zbytečných doplňků.",
  },
  {
    icon: Timer,
    title: "Čerstvá vejce",
    text: "Vejce putují z farmy k zákazníkům co nejrychleji — často ještě týž den.",
  },
  {
    icon: MapPin,
    title: "Lokální původ",
    text: "Farma se nachází v Krnici, vejce vyzvednete pohodlně přímo v Brně.",
  },
];

export function Benefits() {
  return (
    <section className="container-farm py-16 md:py-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={i * 90}>
            <div className="group h-full rounded-3xl border border-brown-300/25 bg-white/50 p-7 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-brown-900/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-cream">
                <b.icon className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-brown-900">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brown-700/70">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
