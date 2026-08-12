"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

const SPECKLES = [
  "radial-gradient(3px 2px at 30% 22%, rgba(150,110,68,0.35), transparent 60%)",
  "radial-gradient(2px 2px at 62% 18%, rgba(150,110,68,0.28), transparent 60%)",
  "radial-gradient(2.5px 2px at 45% 40%, rgba(150,110,68,0.3), transparent 60%)",
  "radial-gradient(2px 1.5px at 72% 48%, rgba(150,110,68,0.22), transparent 60%)",
  "radial-gradient(2.5px 2px at 25% 58%, rgba(150,110,68,0.25), transparent 60%)",
  "radial-gradient(2px 2px at 55% 70%, rgba(150,110,68,0.28), transparent 60%)",
  "radial-gradient(2px 1.5px at 38% 78%, rgba(150,110,68,0.2), transparent 60%)",
  "radial-gradient(2.5px 2px at 68% 30%, rgba(150,110,68,0.24), transparent 60%)",
];

const INITIAL_ROTATE_Y = 8;
const INITIAL_ROTATE_X = -6;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Egg3D({
  className,
  size = 260,
}: {
  className?: string;
  size?: number;
}) {
  const controls = useAnimationControls();
  const drag = useRef({ dragging: false, lastX: 0, rotY: INITIAL_ROTATE_Y, rotX: INITIAL_ROTATE_X });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    controls.start({
      rotateY: [drag.current.rotY, drag.current.rotY + 360],
      transition: { duration: 18, repeat: Infinity, ease: "linear" },
    });
  }, [controls]);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    drag.current.dragging = true;
    setDragging(true);
    drag.current.lastX = e.clientX;
    controls.stop();
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging) return;
    const deltaX = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    drag.current.rotY += deltaX * 0.7;
    controls.set({ rotateY: drag.current.rotY, rotateX: drag.current.rotX });
  }

  function onPointerUp() {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    setDragging(false);
    if (prefersReducedMotion()) return;
    controls.start({
      rotateY: [drag.current.rotY, drag.current.rotY + 360],
      transition: { duration: 18, repeat: Infinity, ease: "linear" },
    });
  }

  return (
    <div className={cn("select-none", className)} style={{ perspective: 1400 }}>
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          role="img"
          aria-label="Interaktivní 3D model vejce, můžete jím otáčet tažením"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          animate={controls}
          initial={{ rotateY: INITIAL_ROTATE_Y, rotateX: INITIAL_ROTATE_X }}
          style={{
            width: size,
            height: size * 1.28,
            transformStyle: "preserve-3d",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
          className="relative mx-auto"
        >
          {/* soft ground shadow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-brown-900/25 blur-xl"
            style={{
              bottom: -size * 0.12,
              width: size * 0.75,
              height: size * 0.16,
              transform: "translateX(-50%) translateZ(-40px)",
            }}
          />
          {/* egg body */}
          <div
            className="absolute inset-0 shadow-[0_30px_60px_-15px_rgba(60,44,28,0.35)]"
            style={{
              borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%",
              background:
                "radial-gradient(circle at 32% 24%, #fffdf7 0%, #f9efd8 22%, #f0dfb8 52%, #ddc191 78%, #c7a473 100%)",
              backgroundImage: `${SPECKLES.join(", ")}, radial-gradient(circle at 32% 24%, #fffdf7 0%, #f9efd8 22%, #f0dfb8 52%, #ddc191 78%, #c7a473 100%)`,
            }}
          />
          {/* highlight */}
          <div
            className="absolute rounded-full bg-white/70 blur-md"
            style={{
              width: size * 0.22,
              height: size * 0.16,
              top: size * 0.14,
              left: size * 0.2,
              transform: "translateZ(2px)",
            }}
          />
          {/* rim shading for depth */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50% 50% 50% 50% / 58% 58% 42% 42%",
              boxShadow: "inset -18px -22px 40px rgba(122,85,48,0.28), inset 12px 14px 30px rgba(255,255,255,0.5)",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
