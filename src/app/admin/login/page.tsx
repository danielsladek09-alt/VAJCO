"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Přihlášení se nezdařilo.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-brown-300/25 bg-white p-8 shadow-xl"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-cream">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-semibold text-brown-900">
          Administrace Vajčo
        </h1>
        <p className="mt-1 text-center text-sm text-brown-700/60">
          Zadejte heslo pro přístup do administrace.
        </p>

        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Heslo"
          className="mt-6 w-full rounded-xl border border-brown-300/40 bg-cream px-4 py-3 outline-none focus:border-green-600"
        />

        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-semibold text-cream transition-all hover:bg-green-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Přihlásit se
        </button>
      </form>
    </div>
  );
}
