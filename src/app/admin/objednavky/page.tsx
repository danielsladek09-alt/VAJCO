import { AdminShell } from "@/components/admin/admin-shell";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { prisma } from "@/lib/prisma";
import { formatDateShort, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } }, pickupLocation: true, timeSlot: true },
  });

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold text-brown-900">Objednávky</h1>
      <p className="mt-1 text-brown-700/60">Spravujte stav jednotlivých objednávek.</p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-brown-300/25 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-brown-900">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-brown-700/60">
                  {order.customerName} · {order.email} · {order.phone}
                </p>
                <p className="mt-1 text-sm text-brown-700/60">
                  {order.pickupLocation.name} — {formatDateShort(order.timeSlot.date)}{" "}
                  {order.timeSlot.startTime}–{order.timeSlot.endTime}
                </p>
                {order.note && (
                  <p className="mt-1 text-sm italic text-brown-700/50">Poznámka: {order.note}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-semibold text-green-700">
                  {formatPrice(order.totalPrice)}
                </span>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-brown-700/70">
              {order.items.map((item) => (
                <li key={item.id} className="rounded-full bg-green-50 px-3 py-1">
                  {item.product.name} ({item.product.size}) × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-brown-300/30 p-10 text-center text-brown-700/50">
            Zatím žádné objednávky.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
