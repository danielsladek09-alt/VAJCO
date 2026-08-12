"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarClock, Loader2, MapPin } from "lucide-react";
import { MapViewDynamic } from "./map-view-dynamic";
import { formatDateCz } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PickupLocation } from "@prisma/client";
import type { SlotWithAvailability } from "@/lib/types";

export function PickupLocationsExplorer({ locations }: { locations: PickupLocation[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(locations[0]?.id ?? null);
  const [slots, setSlots] = useState<SlotWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch below
    setLoading(true);
    fetch(`/api/slots?locationId=${selectedId}`)
      .then((r) => r.json())
      .then((data: SlotWithAvailability[]) => setSlots(data))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const upcomingDates = useMemo(() => {
    const byDate = new Map<string, SlotWithAvailability[]>();
    for (const slot of slots) {
      if (!byDate.has(slot.date)) byDate.set(slot.date, []);
      byDate.get(slot.date)!.push(slot);
    }
    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 4);
  }, [slots]);

  const selected = locations.find((l) => l.id === selectedId);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="space-y-4">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelectedId(loc.id)}
            className={cn(
              "w-full rounded-3xl border p-5 text-left transition-all",
              loc.id === selectedId
                ? "border-green-600 bg-green-50 shadow-md"
                : "border-brown-300/25 bg-white/50 hover:border-green-400/60"
            )}
          >
            <div className="flex items-start gap-3">
              <MapPin
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0",
                  loc.id === selectedId ? "text-green-700" : "text-brown-500"
                )}
              />
              <div>
                <h3 className="font-display text-lg font-semibold text-brown-900">{loc.name}</h3>
                <p className="text-sm text-brown-700/70">
                  {loc.address}, {loc.city}
                </p>
                {loc.description && (
                  <p className="mt-2 text-sm leading-relaxed text-brown-700/60">
                    {loc.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="h-80 overflow-hidden rounded-3xl border border-brown-300/25 md:h-96">
          <MapViewDynamic
            locations={locations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="rounded-3xl border border-brown-300/25 bg-white/50 p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-brown-900">
              <CalendarClock className="h-5 w-5 text-green-700" />
              Nejbližší dostupné termíny{selected ? ` — ${selected.name}` : ""}
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-8 text-brown-700/50">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : upcomingDates.length === 0 ? (
            <p className="mt-4 text-sm text-brown-700/60">
              Pro toto místo momentálně nejsou vypsané žádné termíny.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {upcomingDates.map(([date, daySlots]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-green-50/60 p-4"
                >
                  <p className="text-sm font-semibold capitalize text-brown-900">
                    {formatDateCz(date)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <span
                        key={slot.id}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          slot.remaining > 0
                            ? "bg-white text-brown-800"
                            : "bg-brown-300/30 text-brown-700/40 line-through"
                        )}
                      >
                        {slot.startTime}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <button
            onClick={() => selectedId && router.push(`/objednavka?location=${selectedId}`)}
            disabled={!selectedId}
            className="mt-6 w-full rounded-full bg-green-600 py-3.5 text-sm font-semibold text-cream transition-all hover:scale-[1.01] hover:bg-green-700 disabled:opacity-50"
          >
            Naplánovat vyzvednutí
          </button>
        </div>
      </div>
    </div>
  );
}
