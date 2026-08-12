"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBasket, Trash2, X } from "lucide-react";
import { cartTotal, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { PhotoPlaceholder } from "./photo-placeholder";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe mounted flag
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = cartTotal(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-brown-900/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-brown-300/30 px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-brown-900">
                <ShoppingBasket className="h-5 w-5 text-green-600" />
                Váš košík
              </h2>
              <button
                onClick={closeCart}
                aria-label="Zavřít košík"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brown-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-brown-700/70">
                  <ShoppingBasket className="h-12 w-12 text-brown-300" />
                  <p>Váš košík je zatím prázdný.</p>
                  <Link
                    href="/vejce"
                    onClick={closeCart}
                    className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-105"
                  >
                    Prohlédnout vejce
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-3 rounded-2xl border border-brown-300/20 bg-white/50 p-3"
                    >
                      <PhotoPlaceholder kind="eggs" className="h-16 w-16 shrink-0" rounded="rounded-xl" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-brown-900">{item.name}</p>
                            <p className="text-xs text-brown-700/60">{item.size}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label="Odebrat z košíku"
                            className="text-brown-700/50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-brown-300/40 px-1 py-1">
                            <button
                              onClick={() => setQuantity(item.productId, item.quantity - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brown-100"
                              aria-label="Snížit počet"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brown-100"
                              aria-label="Zvýšit počet"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-green-700">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-brown-300/30 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-brown-700/80">Celkem</span>
                  <span className="font-display text-2xl font-semibold text-brown-900">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link
                  href="/objednavka"
                  onClick={closeCart}
                  className="block w-full rounded-full bg-green-600 py-3.5 text-center font-semibold text-cream shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02] hover:bg-green-700"
                >
                  Pokračovat k objednávce
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
