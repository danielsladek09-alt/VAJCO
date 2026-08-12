import { Quote } from "lucide-react";
import { StarRating } from "./star-rating";
import { Reveal } from "./reveal";
import type { Review } from "@prisma/client";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="container-farm py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-green-700">
          Recenze
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-brown-900 md:text-4xl">
          Co říkají naši zákazníci
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review, i) => (
          <Reveal key={review.id} delay={i * 90}>
            <div className="flex h-full flex-col rounded-3xl border border-brown-300/25 bg-white/60 p-6">
              <Quote className="h-6 w-6 text-egg-yolk" strokeWidth={1.5} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brown-700/80">
                „{review.text}“
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-brown-900">{review.authorName}</span>
                <StarRating rating={review.rating} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
