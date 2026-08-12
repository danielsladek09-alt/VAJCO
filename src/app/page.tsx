import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/hero";
import { Benefits } from "@/components/benefits";
import { ProcessSteps } from "@/components/process-steps";
import { FarmTeaser } from "@/components/farm-teaser";
import { ProductCard } from "@/components/product-card";
import { ReviewsSection } from "@/components/reviews-section";
import { FinalCta } from "@/components/final-cta";
import { Reveal } from "@/components/reveal";

export default async function HomePage() {
  const [products, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { available: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
    prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <>
      <Hero />
      <Benefits />

      <section className="container-farm py-16 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Naše vejce
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brown-900 md:text-4xl">
            Vyberte si čerstvá vejce
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/vejce"
            className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800"
          >
            Zobrazit celou nabídku
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <ProcessSteps />
      <FarmTeaser />
      <ReviewsSection reviews={reviews} />
      <FinalCta />
    </>
  );
}
