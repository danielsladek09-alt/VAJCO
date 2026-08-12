"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { PickupLocation } from "@prisma/client";

type LocationForm = {
  name: string;
  address: string;
  city: string;
  lat: string;
  lng: string;
  description: string;
  active: boolean;
};

const EMPTY_FORM: LocationForm = {
  name: "",
  address: "",
  city: "Brno",
  lat: "",
  lng: "",
  description: "",
  active: true,
};

export function LocationsManager({ initialLocations }: { initialLocations: PickupLocation[] }) {
  const [locations, setLocations] = useState(initialLocations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<LocationForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function startEdit(l: PickupLocation) {
    setEditingId(l.id);
    setCreating(false);
    setForm({
      name: l.name,
      address: l.address,
      city: l.city,
      lat: String(l.lat),
      lng: String(l.lng),
      description: l.description ?? "",
      active: l.active,
    });
  }

  function startCreate() {
    setCreating(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function cancel() {
    setCreating(false);
    setEditingId(null);
  }

  async function save() {
    setSaving(true);
    const payload = {
      name: form.name,
      address: form.address,
      city: form.city,
      lat: Number(form.lat),
      lng: Number(form.lng),
      description: form.description,
      active: form.active,
    };

    if (creating) {
      const res = await fetch("/api/pickup-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLocations((prev) => [...prev, data]);
    } else if (editingId) {
      const res = await fetch(`/api/pickup-locations/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLocations((prev) => prev.map((l) => (l.id === editingId ? data : l)));
    }
    setSaving(false);
    cancel();
  }

  async function remove(id: string) {
    if (!confirm("Opravdu smazat toto výdejní místo? Smažou se i jeho termíny.")) return;
    await fetch(`/api/pickup-locations/${id}`, { method: "DELETE" });
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  const isFormOpen = creating || editingId !== null;

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Přidat místo
        </button>
      </div>

      {isFormOpen && (
        <div className="mt-4 rounded-2xl border border-green-600/30 bg-green-50/50 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brown-900">
              {creating ? "Nové výdejní místo" : "Upravit výdejní místo"}
            </h3>
            <button onClick={cancel} className="text-brown-700/50 hover:text-brown-900">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Název"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              placeholder="Adresa"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Město"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Zeměpisná šířka (lat)"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Zeměpisná délka (lng)"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Aktivní
            </label>
            <textarea
              placeholder="Popis"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm sm:col-span-2"
              rows={2}
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-green-700 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Uložit
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {locations.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-xl border border-brown-300/20 p-4"
          >
            <div>
              <p className="font-semibold text-brown-900">{l.name}</p>
              <p className="text-sm text-brown-700/60">
                {l.address}, {l.city} · {l.lat.toFixed(4)}, {l.lng.toFixed(4)}
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  l.active ? "bg-green-50 text-green-700" : "bg-brown-100 text-brown-700/60"
                }`}
              >
                {l.active ? "Aktivní" : "Neaktivní"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(l)}
                className="rounded-lg p-2 text-brown-700 hover:bg-brown-100"
                aria-label="Upravit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(l.id)}
                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                aria-label="Smazat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
