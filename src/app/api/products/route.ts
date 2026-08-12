import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);

  const products = await prisma.product.findMany({
    where: isAdmin ? undefined : { available: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description ?? "",
      size: body.size,
      price: Number(body.price),
      imageUrl: body.imageUrl ?? null,
      available: Boolean(body.available ?? true),
      stock: Number(body.stock ?? 0),
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json(product, { status: 201 });
}
