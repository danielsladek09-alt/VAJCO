import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { Reveal } from "@/components/reveal";
import { ProcessSteps } from "@/components/process-steps";
import { FinalCta } from "@/components/final-cta";

export const metadata: Metadata = {
  title: "Naše farma — Vajčo",
  description: "Poznejte farmu v Krnici, kde chováme slepice ve volném výběhu a sbíráme čerstvá vejce.",
};

const STORY_BLOCKS = [
  {
    kind: "farm" as const,
    title: "Kde farma je",
    text: "Naše rodinná farma leží v malé obci Krnice, obklopená loukami a poli. Klid, čerstvý vzduch a dostatek prostoru — přesně to, co slepice potřebují k tomu, aby snášely opravdu kvalitní vejce.",
  },
  {
    kind: "hens" as const,
    title: "Jak slepice žijí",
    text: "Chováme menší hejna, aby měla každá slepice dost prostoru. Přes den mají volný přístup ven, na noc a za nepříznivého počasí se schovávají do prostorného, čistého kurníku.",
  },
  {
    kind: "closeup" as const,
    title: "Jak vypadá jejich výběh",
    text: "Výběh je zatravněný, s keři a stínem, kde se slepice mohou přirozeně popelit, hrabat a hledat hmyz. Pravidelně ho střídáme, aby zůstal zdravý a čistý.",
  },
  {
    kind: "hands" as const,
    title: "Čím jsou krmené",
    text: "Základem je obilná směs od místních zemědělců, bez zbytečných doplňků a antibiotik. Zbytek si slepice přiživí samy na výběhu.",
  },
  {
    kind: "basket" as const,
    title: "Od slepice k zákazníkovi",
    text: "Vejce sbíráme ručně každý den, hned třídíme a balíme. Objednávky připravujeme čerstvé, jen pár hodin před vyzvednutím na výdejním místě.",
  },
];

export default function FarmPage() {
  return (
    <div>
      <div className="container-farm py-14 md:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-green-700">
            <MapPin className="h-4 w-4" /> Krnice, Jihomoravský kraj
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-brown-900 md:text-5xl">
            Naše farma
          </h1>
          <p className="mt-4 leading-relaxed text-brown-700/75">
            Malá rodinná farma s velkým důrazem na pohodu slepic a poctivost
            v každém detailu. Toto je náš příběh.
          </p>
        </Reveal>
      </div>

      <div className="container-farm space-y-20 pb-20 md:space-y-28 md:pb-28">
        {STORY_BLOCKS.map((block, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={block.title}
              className={`grid items-center gap-10 md:grid-cols-2 ${
                reversed ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <PhotoPlaceholder kind={block.kind} className="aspect-[4/3] w-full" />
              </Reveal>
              <Reveal delay={100}>
                <span className="font-display text-5xl font-semibold text-green-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-1 font-display text-2xl font-semibold text-brown-900 md:text-3xl">
                  {block.title}
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-brown-700/75">{block.text}</p>
              </Reveal>
            </div>
          );
        })}
      </div>

      <ProcessSteps />
      <FinalCta />
    </div>
  );
}
