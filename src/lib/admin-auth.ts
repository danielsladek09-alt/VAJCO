export const ADMIN_COOKIE_NAME = "vajco_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hodin

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "vajco-dev-secret";
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(sig).toString("hex");
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload);
  if (expected !== sig) return false;
  const expires = Number(payload);
  if (Number.isNaN(expires) || Date.now() > expires) return false;
  return true;
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "vajco2026";
  return password === expected;
}
