"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, Sprout } from "lucide-react";
import { Egg3D } from "./egg-3d";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-green-50 via-cream to-cream"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-egg-shell blur-3xl" />

      <div className="container-farm relative grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-28">
        <motion.div style={{ y, opacity }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-green-600/30 bg-green-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-700"
          >
            <Sprout className="h-3.5 w-3.5" />
            Farma Krnice · volný chov
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.08] text-brown-900 sm:text-5xl lg:text-6xl"
          >
            Čerstvá vejce.
            <br />
            <span className="italic text-green-700">Z naší farmy</span> k vám.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-balance text-lg leading-relaxed text-brown-700/80"
          >
            Volný chov, přirozené prostředí a čerstvost, kterou poznáte na
            první ochutnání.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/vejce"
              className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-cream shadow-lg shadow-green-600/25 transition-all hover:scale-[1.03] hover:bg-green-700"
            >
              Objednat vejce
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/farma"
              className="inline-flex items-center gap-2 rounded-full border border-brown-300/50 bg-cream/60 px-7 py-3.5 text-sm font-semibold text-brown-900 backdrop-blur-sm transition-all hover:scale-[1.03] hover:bg-white"
            >
              Poznat naši farmu
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 text-sm text-brown-700/60"
          >
            <div>
              <p className="whitespace-nowrap font-display text-2xl font-semibold text-brown-900">100 %</p>
              <p>volný chov</p>
            </div>
            <div className="h-8 w-px bg-brown-300/40" />
            <div>
              <p className="whitespace-nowrap font-display text-2xl font-semibold text-brown-900">24 h</p>
              <p>od snesení k výdeji</p>
            </div>
            <div className="h-8 w-px bg-brown-300/40" />
            <div>
              <p className="whitespace-nowrap font-display text-2xl font-semibold text-brown-900">2</p>
              <p>výdejní místa v Brně</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative flex justify-center md:justify-end"
        >
          <Egg3D size={260} className="md:mr-8" />
          <p className="absolute -bottom-2 left-1/2 hidden -translate-x-1/2 text-xs text-brown-700/50 md:block">
            Zkuste vejcem otočit
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex justify-center pb-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-brown-700/40"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
