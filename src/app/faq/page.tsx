import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import { FinalCta } from "@/components/final-cta";

export const metadata: Metadata = {
  title: "Časté dotazy — Vajčo",
  description: "Odpovědi na nejčastější otázky o našich vejcích, chovu slepic a objednávkách.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="container-farm py-14 md:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Časté dotazy
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-brown-900">
            Máte otázku? Máme odpověď
          </h1>
        </Reveal>

        <div className="mt-14">
          <Reveal>
            <FaqAccordion items={items} />
          </Reveal>
        </div>
      </div>
      <FinalCta />
    </div>
  );
}
