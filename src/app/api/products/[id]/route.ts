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
  for (const key of ["name", "slug", "description", "size", "imageUrl"] as const) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.stock !== undefined) data.stock = Number(body.stock);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.available !== undefined) data.available = Boolean(body.available);

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
