import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";
import { generateOrderNumber } from "@/lib/utils";

const orderSchema = z.object({
  customerName: z.string().min(2, "Zadejte prosím jméno."),
  email: z.string().email("Zadejte platný e-mail."),
  phone: z.string().min(6, "Zadejte platné telefonní číslo."),
  note: z.string().optional(),
  pickupLocationId: z.string().min(1, "Vyberte výdejní místo."),
  timeSlotId: z.string().min(1, "Vyberte termín vyzvednutí."),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Košík je prázdný."),
});

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: {
      items: { include: { product: true } },
      pickupLocation: true,
      timeSlot: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Neplatná data objednávky." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const slot = await tx.timeSlot.findUnique({
        where: { id: data.timeSlotId },
        include: { orders: { where: { status: { not: "CANCELLED" } } } },
      });
      if (!slot) throw new Error("SLOT_NOT_FOUND");
      if (slot.pickupLocationId !== data.pickupLocationId) throw new Error("SLOT_MISMATCH");
      if (slot.orders.length >= slot.capacity) throw new Error("SLOT_FULL");

      const productIds = data.items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      if (products.length !== productIds.length) throw new Error("PRODUCT_NOT_FOUND");

      const unavailable = products.find((p) => !p.available);
      if (unavailable) throw new Error("PRODUCT_UNAVAILABLE");

      let totalPrice = 0;
      const itemsData = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        totalPrice += product.price * item.quantity;
        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      });

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: data.customerName,
          email: data.email,
          phone: data.phone,
          note: data.note,
          pickupLocationId: data.pickupLocationId,
          timeSlotId: data.timeSlotId,
          totalPrice,
          items: { create: itemsData },
        },
        include: {
          items: { include: { product: true } },
          pickupLocation: true,
          timeSlot: true,
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN";
    const map: Record<string, { status: number; error: string }> = {
      SLOT_NOT_FOUND: { status: 404, error: "Zvolený termín neexistuje." },
      SLOT_MISMATCH: { status: 400, error: "Termín nepatří k vybranému výdejnímu místu." },
      SLOT_FULL: { status: 409, error: "Tento termín je již plně obsazený. Zvolte prosím jiný." },
      PRODUCT_NOT_FOUND: { status: 404, error: "Některý produkt už není dostupný." },
      PRODUCT_UNAVAILABLE: { status: 409, error: "Některý produkt je momentálně vyprodaný." },
    };
    const mapped = map[message] ?? { status: 500, error: "Objednávku se nepodařilo vytvořit." };
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
