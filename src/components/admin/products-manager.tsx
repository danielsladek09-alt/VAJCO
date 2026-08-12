"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@prisma/client";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  size: string;
  price: string;
  stock: string;
  available: boolean;
};

const EMPTY_FORM: ProductForm = {
  name: "",
  slug: "",
  description: "",
  size: "",
  price: "",
  stock: "",
  available: true,
};

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setCreating(false);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      size: p.size,
      price: String(p.price),
      stock: String(p.stock),
      available: p.available,
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
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description,
      size: form.size,
      price: Number(form.price),
      stock: Number(form.stock),
      available: form.available,
    };

    if (creating) {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setProducts((prev) => [...prev, data]);
    } else if (editingId) {
      const res = await fetch(`/api/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === editingId ? data : p)));
    }
    setSaving(false);
    cancel();
  }

  async function remove(id: string) {
    if (!confirm("Opravdu smazat tento produkt?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function toggleAvailable(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !p.available }),
    });
    const data = await res.json();
    setProducts((prev) => prev.map((x) => (x.id === p.id ? data : x)));
  }

  const isFormOpen = creating || editingId !== null;

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-cream hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Přidat produkt
        </button>
      </div>

      {isFormOpen && (
        <div className="mt-4 rounded-2xl border border-green-600/30 bg-green-50/50 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brown-900">
              {creating ? "Nový produkt" : "Upravit produkt"}
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
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Slug (URL)"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Velikost balení (např. 10 ks)"
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Cena (Kč)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Skladem (ks)"
              type="number"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="rounded-lg border border-brown-300/40 bg-white px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              />
              Dostupné
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

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-brown-700/50">
            <tr>
              <th className="pb-2">Název</th>
              <th className="pb-2">Velikost</th>
              <th className="pb-2">Cena</th>
              <th className="pb-2">Sklad</th>
              <th className="pb-2">Dostupnost</th>
              <th className="pb-2 text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-brown-300/15">
                <td className="py-2.5 font-medium text-brown-900">{p.name}</td>
                <td className="py-2.5">{p.size}</td>
                <td className="py-2.5">{formatPrice(p.price)}</td>
                <td className="py-2.5">{p.stock}</td>
                <td className="py-2.5">
                  <button
                    onClick={() => toggleAvailable(p)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.available ? "bg-green-50 text-green-700" : "bg-brown-100 text-brown-700/60"
                    }`}
                  >
                    {p.available ? "Dostupné" : "Vyprodáno"}
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded-lg p-2 text-brown-700 hover:bg-brown-100"
                      aria-label="Upravit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label="Smazat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
