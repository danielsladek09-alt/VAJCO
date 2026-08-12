import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PickupLocationsExplorer } from "@/components/pickup-locations-explorer";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Výdejní místa — Vajčo",
  description: "Kde si vyzvednete čerstvá vejce? Podívejte se na mapu výdejních míst a rezervujte si termín.",
};

export const dynamic = "force-dynamic";

export default async function PickupLocationsPage() {
  const locations = await prisma.pickupLocation.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container-farm py-14 md:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
          Výdejní místa
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-brown-900">
          Kde si vejce vyzvednete
        </h1>
        <p className="mt-4 leading-relaxed text-brown-700/75">
          Vyberte si výdejní místo, prohlédněte si dostupné termíny a
          naplánujte si vyzvednutí přesně podle sebe.
        </p>
      </Reveal>

      <div className="mt-14">
        <Reveal>
          <PickupLocationsExplorer locations={locations} />
        </Reveal>
      </div>
    </div>
  );
}
