import { NextResponse } from "next/server";
import {
  checkRateLimit,
  clearFailedAttempts,
  getAdminPassword,
  recordFailedAttempt,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!getAdminPassword()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD belum diset di Environment Variables. Tambahkan ADMIN_PASSWORD di Vercel Settings -> Environment Variables lalu redeploy.",
      },
      { status: 503 }
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const clientKey = forwarded ? forwarded.split(",")[0].trim() : "local";
  const rate = checkRateLimit(clientKey);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan login. Coba lagi dalam ${rate.retryAfterSeconds ?? 60} detik.`,
      },
      { status: 429 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyPassword(password)) {
    recordFailedAttempt(clientKey);
    return NextResponse.json(
      { error: "Password salah." },
      { status: 401 }
    );
  }

  clearFailedAttempts(clientKey);
  await setAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
