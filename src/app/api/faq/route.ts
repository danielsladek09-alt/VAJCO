import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export async function GET() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  if (!isAdmin) return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });

  const body = await req.json();
  const item = await prisma.faqItem.create({
    data: {
      question: body.question,
      answer: body.answer,
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json(item, { status: 201 });
}
