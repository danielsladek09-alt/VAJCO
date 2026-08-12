import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);

  const locations = await prisma.pickupLocation.findMany({
    where: isAdmin ? undefined : { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(locations);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const body = await req.json();
  const location = await prisma.pickupLocation.create({
    data: {
      name: body.name,
      address: body.address,
      city: body.city,
      lat: Number(body.lat),
      lng: Number(body.lng),
      description: body.description ?? null,
      active: Boolean(body.active ?? true),
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json(location, { status: 201 });
}
