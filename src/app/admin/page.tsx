import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { CalendarClock, Egg, MapPin, MessageSquareQuote, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, newOrders, locationCount, reviewCount, revenue] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "NEW" } }),
      prisma.pickupLocation.count(),
      prisma.review.count(),
      prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: { not: "CANCELLED" } } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { pickupLocation: true, timeSlot: true },
  });

  const stats = [
    { label: "Produkty", value: productCount, icon: Egg, href: "/admin/produkty" },
    { label: "Objednávky celkem", value: orderCount, icon: ShoppingBag, href: "/admin/objednavky" },
    { label: "Nové objednávky", value: newOrders, icon: ShoppingBag, href: "/admin/objednavky" },
    { label: "Výdejní místa", value: locationCount, icon: MapPin, href: "/admin/vydejni-mista" },
    { label: "Recenze", value: reviewCount, icon: MessageSquareQuote, href: "/admin/recenze" },
  ];

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold text-brown-900">Přehled</h1>
      <p className="mt-1 text-brown-700/60">
        Vítejte v administraci. Tržby (nezrušené objednávky): {formatPrice(revenue._sum.totalPrice ?? 0)}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-brown-300/25 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <s.icon className="h-5 w-5 text-green-600" />
            <p className="mt-3 font-display text-2xl font-semibold text-brown-900">{s.value}</p>
            <p className="text-sm text-brown-700/60">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-brown-300/25 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-brown-900">Poslední objednávky</h2>
          <Link href="/admin/objednavky" className="text-sm font-medium text-green-700 hover:underline">
            Zobrazit vše
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-brown-700/50">
              <tr>
                <th className="pb-2">Číslo</th>
                <th className="pb-2">Zákazník</th>
                <th className="pb-2">Výdejní místo</th>
                <th className="pb-2">Termín</th>
                <th className="pb-2">Stav</th>
                <th className="pb-2 text-right">Cena</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-brown-300/15">
                  <td className="py-2 font-medium text-brown-900">{o.orderNumber}</td>
                  <td className="py-2">{o.customerName}</td>
                  <td className="py-2">{o.pickupLocation.name}</td>
                  <td className="py-2">
                    {o.timeSlot.date} {o.timeSlot.startTime}
                  </td>
                  <td className="py-2">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-2 text-right">{formatPrice(o.totalPrice)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-brown-700/50">
                    Zatím žádné objednávky.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-sm text-brown-700/50">
        <CalendarClock className="h-4 w-4" />
        Tip: v sekci Termíny nastavte kapacitu jednotlivých výdejních slotů.
      </div>
    </AdminShell>
  );
}
