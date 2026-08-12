"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { PickupLocation } from "@prisma/client";
import type { SlotWithAvailability } from "@/lib/types";

export function SlotsManager({ locations }: { locations: PickupLocation[] }) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [slots, setSlots] = useState<SlotWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "", capacity: "5" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch below
    setLoading(true);
    fetch(`/api/slots?locationId=${locationId}`)
      .then((r) => r.json())
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [locationId]);

  async function addSlot() {
    setError(null);
    if (!form.date || !form.startTime || !form.endTime) {
      setError("Vyplňte prosím datum a čas.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLocationId: locationId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        capacity: Number(form.capacity),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Termín se nepodařilo vytvořit.");
      setSaving(false);
      return;
    }
    setSlots((prev) => [...prev, { ...data, booked: 0, remaining: data.capacity }].sort(
      (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    ));
    setForm({ date: "", startTime: "", endTime: "", capacity: "5" });
    setSaving(false);
  }

  async function updateCapacity(id: string, capacity: number) {
    const res = await fetch(`/api/slots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capacity }),
    });
    const data = await res.json();
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, capacity: data.capacity, remaining: Math.max(0, data.capacity - s.booked) } : s))
    );
  }

  async function removeSlot(id: string) {
    if (!confirm("Opravdu smazat tento termín?")) return;
    await fetch(`/api/slots/${id}`, { method: "DELETE" });
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <label className="text-sm font-medium text-brown-800">
        Výdejní místo
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="mt-1 block w-full max-w-sm rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
        >
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 rounded-2xl border border-green-600/30 bg-green-50/50 p-5">
        <h3 className="font-semibold text-brown-900">Přidat termín</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
            className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={1}
            placeholder="Kapacita"
            value={form.capacity}
            onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        <button
          onClick={addSlot}
          disabled={saving}
          className="mt-3 flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Přidat termín
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8 text-brown-700/50">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-brown-700/50">
              <tr>
                <th className="pb-2">Datum</th>
                <th className="pb-2">Čas</th>
                <th className="pb-2">Obsazenost</th>
                <th className="pb-2">Kapacita</th>
                <th className="pb-2 text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id} className="border-t border-brown-300/15">
                  <td className="py-2.5">{formatDateShort(s.date)}</td>
                  <td className="py-2.5">
                    {s.startTime}–{s.endTime}
                  </td>
                  <td className="py-2.5">
                    {s.booked} / {s.capacity}
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      min={s.booked}
                      defaultValue={s.capacity}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val !== s.capacity && val >= s.booked) updateCapacity(s.id, val);
                      }}
                      className="w-20 rounded-lg border border-brown-300/40 bg-white px-2 py-1"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => removeSlot(s.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label="Smazat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {slots.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-brown-700/50">
                    Pro toto místo zatím nejsou vypsané žádné termíny.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
