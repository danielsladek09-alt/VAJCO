import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

const VALID_STATUSES = ["NEW", "CONFIRMED", "PREPARED", "PICKED_UP", "CANCELLED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Neplatný stav objednávky." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status },
    include: {
      items: { include: { product: true } },
      pickupLocation: true,
      timeSlot: true,
    },
  });
  return NextResponse.json(order);
}
