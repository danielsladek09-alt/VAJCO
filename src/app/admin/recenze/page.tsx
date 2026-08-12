import { AdminShell } from "@/components/admin/admin-shell";
import { ReviewsManager } from "@/components/admin/reviews-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold text-brown-900">Recenze</h1>
      <p className="mt-1 text-brown-700/60">Přidávejte, skrývejte a mažte recenze zákazníků.</p>
      <div className="mt-8 rounded-2xl border border-brown-300/25 bg-white p-6">
        <ReviewsManager initialReviews={reviews} />
      </div>
    </AdminShell>
  );
}
