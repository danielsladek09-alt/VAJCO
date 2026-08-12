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
  for (const key of ["name", "address", "city", "description"] as const) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.lat !== undefined) data.lat = Number(body.lat);
  if (body.lng !== undefined) data.lng = Number(body.lng);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.active !== undefined) data.active = Boolean(body.active);

  const location = await prisma.pickupLocation.update({ where: { id }, data });
  return NextResponse.json(location);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.pickupLocation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
