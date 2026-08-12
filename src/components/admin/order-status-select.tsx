"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "./status-badge";

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  async function handleChange(newStatus: string) {
    setValue(newStatus);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className="rounded-lg border border-brown-300/40 bg-cream px-2 py-1.5 text-sm outline-none focus:border-green-600 disabled:opacity-60"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
