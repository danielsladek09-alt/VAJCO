import { AdminShell } from "@/components/admin/admin-shell";
import { ProductsManager } from "@/components/admin/products-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold text-brown-900">Produkty</h1>
      <p className="mt-1 text-brown-700/60">Přidávejte a upravujte produkty, ceny a dostupnost.</p>
      <div className="mt-8 rounded-2xl border border-brown-300/25 bg-white p-6">
        <ProductsManager initialProducts={products} />
      </div>
    </AdminShell>
  );
}
