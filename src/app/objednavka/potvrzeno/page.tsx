"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, CalendarClock } from "lucide-react";
import { formatDateCz, formatPrice } from "@/lib/utils";

type OrderDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  totalPrice: number;
  note: string | null;
  items: { id: string; quantity: number; unitPrice: number; product: { name: string; size: string } }[];
  pickupLocation: { name: string; address: string; city: string };
  timeSlot: { date: string; startTime: string; endTime: string };
};

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reacts to a missing query param
      setError("Objednávka nebyla nalezena.");
      return;
    }
    fetch(`/api/orders/lookup?id=${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setOrder)
      .catch(() => setError("Objednávku se nepodařilo najít."));
  }, [id]);

  if (error) {
    return (
      <div className="container-farm flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-brown-700/70">{error}</p>
        <Link href="/vejce" className="text-green-700 underline">
          Zpět na e-shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-farm flex justify-center py-24 text-brown-700/50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-farm py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-[2rem] border border-green-600/20 bg-green-50/60 p-8 text-center md:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-cream"
        >
          <CheckCircle2 className="h-9 w-9" />
        </motion.div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-brown-900 md:text-4xl">
          Objednávka je potvrzena
        </h1>
        <p className="mt-3 text-brown-700/75">
          Děkujeme, {order.customerName}! Vaše čerstvá vejce na vás budou
          čekat na zvoleném výdejním místě.
        </p>
        <p className="mt-1 text-sm font-medium text-brown-700/60">
          Číslo objednávky: <span className="font-semibold text-brown-900">{order.orderNumber}</span>
        </p>

        <div className="mt-8 space-y-4 rounded-2xl bg-white/70 p-6 text-left">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
            <div>
              <p className="font-semibold text-brown-900">{order.pickupLocation.name}</p>
              <p className="text-sm text-brown-700/60">
                {order.pickupLocation.address}, {order.pickupLocation.city}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
            <div>
              <p className="font-semibold capitalize text-brown-900">
                {formatDateCz(order.timeSlot.date)}
              </p>
              <p className="text-sm text-brown-700/60">
                {order.timeSlot.startTime}–{order.timeSlot.endTime}
              </p>
            </div>
          </div>

          <div className="border-t border-brown-300/20 pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-brown-700/80">
                <span>
                  {item.product.name} ({item.product.size}) × {item.quantity}
                </span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t border-brown-300/20 pt-3 font-semibold text-brown-900">
              <span>Celkem k úhradě na místě</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-cream transition-transform hover:scale-105"
        >
          Zpět na hlavní stránku
        </Link>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationInner />
    </Suspense>
  );
}
