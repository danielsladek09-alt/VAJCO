import { AdminShell } from "@/components/admin/admin-shell";
import { LocationsManager } from "@/components/admin/locations-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const locations = await prisma.pickupLocation.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold text-brown-900">Výdejní místa</h1>
      <p className="mt-1 text-brown-700/60">Spravujte adresy a souřadnice výdejních míst.</p>
      <div className="mt-8 rounded-2xl border border-brown-300/25 bg-white p-6">
        <LocationsManager initialLocations={locations} />
      </div>
    </AdminShell>
  );
}
