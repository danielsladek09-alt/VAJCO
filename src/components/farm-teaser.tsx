import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhotoPlaceholder } from "./photo-placeholder";
import { Reveal } from "./reveal";

export function FarmTeaser() {
  return (
    <section className="container-farm py-16 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Reveal className="grid grid-cols-2 gap-4">
          <PhotoPlaceholder kind="farm" className="col-span-2 aspect-[16/10]" />
          <PhotoPlaceholder kind="hens" className="aspect-square" />
          <PhotoPlaceholder kind="hands" className="aspect-square" />
        </Reveal>

        <Reveal delay={120}>
          <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Naše farma
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-brown-900 md:text-4xl">
            Příběh, který začíná ve výběhu v Krnici
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-brown-700/75">
            Naše slepice žijí v prostorném výběhu obklopeném zelení, kde se mohou
            volně pohybovat, hrabat a popelit. Krmíme je poctivě a přirozeně —
            a je to na vejcích znát. Podívejte se, jak celá cesta od slepice
            až k vám doma vypadá.
          </p>
          <Link
            href="/farma"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-600/40 px-6 py-3 text-sm font-semibold text-green-700 transition-all hover:bg-green-600 hover:text-cream"
          >
            Poznat naši farmu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
