"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import type { Review } from "@prisma/client";

const EMPTY_FORM = { authorName: "", rating: "5", text: "", published: true };

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function addReview() {
    setSaving(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating: Number(form.rating) }),
    });
    const data = await res.json();
    setReviews((prev) => [data, ...prev]);
    setForm(EMPTY_FORM);
    setCreating(false);
    setSaving(false);
  }

  async function togglePublished(r: Review) {
    const res = await fetch(`/api/reviews/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !r.published }),
    });
    const data = await res.json();
    setReviews((prev) => prev.map((x) => (x.id === r.id ? data : x)));
  }

  async function remove(id: string) {
    if (!confirm("Opravdu smazat tuto recenzi?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => setCreating((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-green-700"
        >
          {creating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {creating ? "Zrušit" : "Přidat recenzi"}
        </button>
      </div>

      {creating && (
        <div className="mt-4 rounded-2xl border border-green-600/30 bg-green-50/50 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Jméno autora"
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} hvězdiček
                </option>
              ))}
            </select>
            <textarea
              placeholder="Text recenze"
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm sm:col-span-2"
              rows={3}
            />
          </div>
          <button
            onClick={addReview}
            disabled={saving}
            className="mt-3 flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-cream hover:bg-green-700 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Uložit recenzi
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 rounded-xl border border-brown-300/20 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-brown-900">{r.authorName}</span>
                <StarRating rating={r.rating} />
              </div>
              <p className="mt-1 text-sm text-brown-700/70">{r.text}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => togglePublished(r)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  r.published ? "bg-green-50 text-green-700" : "bg-brown-100 text-brown-700/60"
                }`}
              >
                {r.published ? "Zveřejněno" : "Skryto"}
              </button>
              <button
                onClick={() => remove(r.id)}
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
