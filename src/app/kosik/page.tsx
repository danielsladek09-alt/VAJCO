"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBasket, Trash2, ArrowRight } from "lucide-react";
import { cartTotal, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { PhotoPlaceholder } from "@/components/photo-placeholder";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe mounted flag
  useEffect(() => setMounted(true), []);

  const total = mounted ? cartTotal(items) : 0;

  return (
    <div className="container-farm py-14 md:py-20">
      <h1 className="font-display text-4xl font-semibold text-brown-900">Váš košík</h1>

      {!mounted ? null : items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <ShoppingBasket className="h-14 w-14 text-brown-300" />
          <p className="text-brown-700/70">Váš košík je zatím prázdný.</p>
          <Link
            href="/vejce"
            className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-105"
          >
            Prohlédnout vejce
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex gap-4 rounded-3xl border border-brown-300/25 bg-white/50 p-4"
                >
                  <PhotoPlaceholder kind="eggs" className="h-24 w-24 shrink-0" rounded="rounded-2xl" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold text-brown-900">{item.name}</p>
                        <p className="text-sm text-brown-700/60">{item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-brown-700/50 hover:text-red-600 transition-colors"
                        aria-label="Odebrat z košíku"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-brown-300/40 px-1 py-1">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-brown-100"
                          aria-label="Snížit počet"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-brown-100"
                          aria-label="Zvýšit počet"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="font-display text-lg font-semibold text-green-700">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="h-fit rounded-3xl border border-brown-300/25 bg-white/60 p-6">
            <h2 className="font-display text-xl font-semibold text-brown-900">Přehled objednávky</h2>
            <div className="mt-4 space-y-2 text-sm text-brown-700/75">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>
                    {item.name} ({item.size}) × {item.quantity}
                  </span>
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
            <Link
              href="/objednavka"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3.5 text-sm font-semibold text-cream transition-all hover:scale-[1.02] hover:bg-green-700"
            >
              Pokračovat k objednávce
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
