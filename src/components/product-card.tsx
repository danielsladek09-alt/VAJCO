"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBasket, Check } from "lucide-react";
import { PhotoPlaceholder } from "./photo-placeholder";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@prisma/client";

export function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  function handleAdd() {
    if (!product.available) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        size: product.size,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
    setQty(1);
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-brown-300/25 bg-white/60 shadow-sm transition-shadow hover:shadow-xl hover:shadow-brown-900/10"
    >
      <div className="relative">
        <PhotoPlaceholder
          kind={product.slug.includes("xl") ? "closeup" : product.slug.includes("dark") ? "basket" : "eggs"}
          className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
          rounded="rounded-none"
        />
        {!product.available && (
          <span className="absolute left-3 top-3 rounded-full bg-brown-900/85 px-3 py-1 text-xs font-semibold text-cream">
            Vyprodáno
          </span>
        )}
        {product.available && product.stock <= 10 && (
          <span className="absolute left-3 top-3 rounded-full bg-egg-yolk px-3 py-1 text-xs font-semibold text-brown-900">
            Poslední kusy
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-brown-900">{product.name}</h3>
          <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            {product.size}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brown-700/70">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-brown-900">
            {formatPrice(product.price)}
          </span>
          {product.available ? (
            <div className="flex items-center gap-1 rounded-full border border-brown-300/40 px-1 py-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-brown-100"
                aria-label="Snížit počet"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-brown-100"
                aria-label="Zvýšit počet"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.available}
          onAnimationEnd={() => {}}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-semibold text-cream transition-all hover:bg-green-700 hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-brown-300 disabled:text-brown-700/60 disabled:hover:scale-100"
        >
          {justAdded ? (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> Přidáno do košíku
            </motion.span>
          ) : (
            <>
              <ShoppingBasket className="h-4 w-4" />
              {product.available ? "Přidat do košíku" : "Vyprodáno"}
            </>
          )}
        </button>
        {justAdded && (
          <button
            onClick={openCart}
            className="mt-2 text-center text-xs font-medium text-green-700 underline underline-offset-2 hover:text-green-800"
          >
            Zobrazit košík
          </button>
        )}
      </div>
    </motion.div>
  );
}
