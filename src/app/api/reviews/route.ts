import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);

  const reviews = await prisma.review.findMany({
    where: isAdmin ? undefined : { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const body = await req.json();
  const review = await prisma.review.create({
    data: {
      authorName: body.authorName,
      rating: Number(body.rating ?? 5),
      text: body.text,
      published: Boolean(body.published ?? true),
    },
  });
  return NextResponse.json(review, { status: 201 });
}
