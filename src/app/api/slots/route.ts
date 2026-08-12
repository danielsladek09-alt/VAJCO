import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  const from = searchParams.get("from");

  const slots = await prisma.timeSlot.findMany({
    where: {
      ...(locationId ? { pickupLocationId: locationId } : {}),
      ...(from ? { date: { gte: from } } : {}),
    },
    include: {
      orders: { where: { status: { not: "CANCELLED" } }, select: { id: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const result = slots.map((slot) => ({
    id: slot.id,
    pickupLocationId: slot.pickupLocationId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    capacity: slot.capacity,
    booked: slot.orders.length,
    remaining: Math.max(0, slot.capacity - slot.orders.length),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const body = await req.json();
  try {
    const slot = await prisma.timeSlot.create({
      data: {
        pickupLocationId: body.pickupLocationId,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        capacity: Number(body.capacity ?? 5),
      },
    });
    return NextResponse.json(slot, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Termín pro toto místo, datum a čas už existuje." },
      { status: 409 }
    );
  }
}
