"use client";

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, ShoppingBasket } from "lucide-react";
import { cartTotal, useCartStore } from "@/lib/cart-store";
import { cn, formatDateCz, formatPrice } from "@/lib/utils";
import type { PickupLocation } from "@prisma/client";
import type { SlotWithAvailability } from "@/lib/types";

function OrderPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [locationId, setLocationId] = useState<string>(searchParams.get("location") ?? "");
  const [slots, setSlots] = useState<SlotWithAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({ customerName: "", email: "", phone: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe mounted flag
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/pickup-locations")
      .then((r) => r.json())
      .then((data: PickupLocation[]) => {
        setLocations(data);
        if (!locationId && data.length > 0) setLocationId(data[0].id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!locationId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets slot selection when location changes
    setLoadingSlots(true);
    setSelectedDate("");
    setSelectedSlotId("");
    fetch(`/api/slots?locationId=${locationId}`)
      .then((r) => r.json())
      .then((data: SlotWithAvailability[]) => setSlots(data))
      .finally(() => setLoadingSlots(false));
  }, [locationId]);

  const dates = useMemo(() => {
    const unique = Array.from(new Set(slots.map((s) => s.date))).sort();
    return unique.slice(0, 10);
  }, [slots]);

  const slotsForDate = useMemo(
    () => slots.filter((s) => s.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [slots, selectedDate]
  );

  const total = mounted ? cartTotal(items) : 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Váš košík je prázdný.");
      return;
    }
    if (!locationId || !selectedSlotId) {
      setError("Vyberte prosím výdejní místo a termín vyzvednutí.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pickupLocationId: locationId,
          timeSlotId: selectedSlotId,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Objednávku se nepodařilo odeslat.");
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/objednavka/potvrzeno?id=${data.id}`);
    } catch {
      setError("Objednávku se nepodařilo odeslat. Zkuste to prosím znovu.");
      setSubmitting(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <div className="container-farm flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBasket className="h-14 w-14 text-brown-300" />
        <h1 className="font-display text-2xl font-semibold text-brown-900">Košík je prázdný</h1>
        <p className="text-brown-700/70">Nejdřív si prosím vyberte vejce, která chcete objednat.</p>
        <Link
          href="/vejce"
          className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-105"
        >
          Prohlédnout vejce
        </Link>
      </div>
    );
  }

  return (
    <div className="container-farm py-14 md:py-20">
      <h1 className="font-display text-4xl font-semibold text-brown-900">Dokončit objednávku</h1>
      <p className="mt-2 text-brown-700/70">Vyplňte údaje, vyberte výdejní místo a termín vyzvednutí.</p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-brown-300/25 bg-white/50 p-6">
            <h2 className="font-display text-xl font-semibold text-brown-900">Kontaktní údaje</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-brown-800 sm:col-span-2">
                Jméno a příjmení
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-brown-300/40 bg-cream px-4 py-3 text-brown-900 outline-none focus:border-green-600"
                  placeholder="Jana Nováková"
                />
              </label>
              <label className="text-sm font-medium text-brown-800">
                E-mail
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-brown-300/40 bg-cream px-4 py-3 text-brown-900 outline-none focus:border-green-600"
                  placeholder="jana@email.cz"
                />
              </label>
              <label className="text-sm font-medium text-brown-800">
                Telefon
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-brown-300/40 bg-cream px-4 py-3 text-brown-900 outline-none focus:border-green-600"
                  placeholder="+420 777 123 456"
                />
              </label>
              <label className="text-sm font-medium text-brown-800 sm:col-span-2">
                Poznámka (nepovinné)
                <textarea
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-brown-300/40 bg-cream px-4 py-3 text-brown-900 outline-none focus:border-green-600"
                  placeholder="Např. jiný čas vyhovuje lépe, alergie apod."
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-brown-300/25 bg-white/50 p-6">
            <h2 className="font-display text-xl font-semibold text-brown-900">Výdejní místo</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {locations.map((loc) => (
                <button
                  type="button"
                  key={loc.id}
                  onClick={() => setLocationId(loc.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    loc.id === locationId
                      ? "border-green-600 bg-green-50"
                      : "border-brown-300/25 hover:border-green-400/60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-700" />
                    <span className="font-semibold text-brown-900">{loc.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-brown-700/60">{loc.address}, {loc.city}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-brown-300/25 bg-white/50 p-6">
            <h2 className="font-display text-xl font-semibold text-brown-900">Termín vyzvednutí</h2>

            {loadingSlots ? (
              <div className="flex justify-center py-8 text-brown-700/50">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : dates.length === 0 ? (
              <p className="mt-4 text-sm text-brown-700/60">
                Pro vybrané místo momentálně nejsou k dispozici žádné termíny.
              </p>
            ) : (
              <>
                <p className="mt-4 mb-2 text-sm font-medium text-brown-800">Datum</p>
                <div className="flex flex-wrap gap-2">
                  {dates.map((date) => (
                    <button
                      type="button"
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlotId("");
                      }}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm capitalize transition-all",
                        date === selectedDate
                          ? "border-green-600 bg-green-600 text-cream"
                          : "border-brown-300/30 text-brown-800 hover:border-green-400"
                      )}
                    >
                      {formatDateCz(date)}
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <>
                    <p className="mt-5 mb-2 text-sm font-medium text-brown-800">Čas</p>
                    <div className="flex flex-wrap gap-2">
                      {slotsForDate.map((slot) => {
                        const full = slot.remaining <= 0;
                        return (
                          <button
                            type="button"
                            key={slot.id}
                            disabled={full}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm transition-all",
                              full
                                ? "cursor-not-allowed border-brown-300/20 text-brown-700/30 line-through"
                                : slot.id === selectedSlotId
                                ? "border-egg-yolk bg-egg-yolk text-brown-900"
                                : "border-brown-300/30 text-brown-800 hover:border-green-400"
                            )}
                          >
                            {slot.startTime}–{slot.endTime}
                            {!full && slot.remaining <= 2 && (
                              <span className="ml-1 text-xs text-green-700">({slot.remaining} volných)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </section>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="h-fit space-y-4">
          <div className="rounded-3xl border border-brown-300/25 bg-white/60 p-6">
            <h2 className="font-display text-xl font-semibold text-brown-900">Souhrn objednávky</h2>
            <div className="mt-4 space-y-2 text-sm text-brown-700/75">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.name} ({item.size}) × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-brown-300/25 pt-4">
              <span className="font-semibold text-brown-900">Celkem</span>
              <span className="font-display text-2xl font-semibold text-brown-900">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-3 text-xs text-brown-700/50">Platba probíhá osobně při vyzvednutí.</p>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3.5 text-sm font-semibold text-cream transition-all hover:scale-[1.02] hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {submitting ? "Odesílám…" : "Odeslat objednávku"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderPageInner />
    </Suspense>
  );
}
