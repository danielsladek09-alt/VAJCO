import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Naše vejce — Vajčo",
  description: "Vyberte si čerstvá vejce z volného chovu z farmy v Krnici a přidejte je do košíku.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="container-farm py-14 md:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
          E-shop
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-brown-900">
          Naše vejce
        </h1>
        <p className="mt-4 leading-relaxed text-brown-700/75">
          Vejce sbíráme každý den ručně a balíme čerstvá, jen pár hodin před
          vyzvednutím. Vyberte si balení, přidejte do košíku a zvolte
          výdejní místo i termín.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-10 text-center text-brown-700/60">
          Momentálně nemáme žádné produkty k dispozici. Zkuste to prosím
          později.
        </p>
      )}
    </div>
  );
}
