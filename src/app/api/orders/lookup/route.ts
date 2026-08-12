import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Chybí ID objednávky." }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      pickupLocation: true,
      timeSlot: true,
    },
  });
  if (!order) return NextResponse.json({ error: "Objednávka nenalezena." }, { status: 404 });

  const { email: _email, phone: _phone, ...publicOrder } = order;
  void _email;
  void _phone;
  return NextResponse.json(publicOrder);
}
