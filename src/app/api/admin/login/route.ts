import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkAdminPassword, createSessionToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const password = String(body?.password ?? "");

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
