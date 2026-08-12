import { cn } from "@/lib/utils";
import { Camera, Egg, Home, Leaf, Sun, type LucideIcon } from "lucide-react";

type PlaceholderKind = "eggs" | "hens" | "farm" | "hands" | "basket" | "closeup";

const KIND_CONFIG: Record<
  PlaceholderKind,
  { gradient: string; icon: LucideIcon; label: string }
> = {
  eggs: {
    gradient: "from-egg-shell via-cream-warm to-brown-100",
    icon: Egg,
    label: "Foto: čerstvá vejce",
  },
  hens: {
    gradient: "from-green-100 via-cream-warm to-brown-100",
    icon: Sun,
    label: "Foto: slepice ve výběhu",
  },
  farm: {
    gradient: "from-green-100 via-green-50 to-cream-warm",
    icon: Home,
    label: "Foto: farma Krnice",
  },
  hands: {
    gradient: "from-brown-100 via-cream-warm to-egg-shell",
    icon: Leaf,
    label: "Foto: sběr vajec",
  },
  basket: {
    gradient: "from-cream-deep via-brown-100 to-cream-warm",
    icon: Egg,
    label: "Foto: košík s vejci",
  },
  closeup: {
    gradient: "from-egg-shell via-brown-100 to-cream-deep",
    icon: Camera,
    label: "Foto: detail skořápky",
  },
};

export function PhotoPlaceholder({
  kind = "eggs",
  className,
  label,
  rounded = "rounded-3xl",
}: {
  kind?: PlaceholderKind;
  className?: string;
  label?: string;
  rounded?: string;
}) {
  const config = KIND_CONFIG[kind];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        config.gradient,
        rounded,
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`dots-${kind}`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="2.2" fill="var(--color-brown-700)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${kind})`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brown-700/70">
        <Icon className="h-9 w-9 md:h-11 md:w-11" strokeWidth={1.3} />
        <span className="rounded-full bg-cream/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-brown-700/80 backdrop-blur-sm">
          {label ?? config.label}
        </span>
      </div>
    </div>
  );
}
