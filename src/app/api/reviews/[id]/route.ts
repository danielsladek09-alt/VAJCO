import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  for (const key of ["authorName", "text"] as const) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.rating !== undefined) data.rating = Number(body.rating);
  if (body.published !== undefined) data.published = Boolean(body.published);

  const review = await prisma.review.update({ where: { id }, data });
  return NextResponse.json(review);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
