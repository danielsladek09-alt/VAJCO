import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Hodnocení ${rating} z 5 hvězdiček`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-egg-yolk text-egg-yolk" : "fill-transparent text-brown-300"
          )}
        />
      ))}
    </div>
  );
}
