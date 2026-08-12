import { AdminShell } from "@/components/admin/admin-shell";
import { SlotsManager } from "@/components/admin/slots-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  const locations = await prisma.pickupLocation.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold text-brown-900">Termíny</h1>
      <p className="mt-1 text-brown-700/60">
        Nastavte dostupné termíny a kapacitu pro jednotlivá výdejní místa.
      </p>
      <div className="mt-8 rounded-2xl border border-brown-300/25 bg-white p-6">
        {locations.length === 0 ? (
          <p className="text-brown-700/60">Nejprve vytvořte výdejní místo.</p>
        ) : (
          <SlotsManager locations={locations} />
        )}
      </div>
    </AdminShell>
  );
}
