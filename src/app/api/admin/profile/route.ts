import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  detectStorageBackend,
  getProfileContent,
  saveProfileContent,
} from "@/lib/profile-store";
import type { ProfileContent } from "@/types/profile-content";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getProfileContent();
  return NextResponse.json({
    content,
    storage: detectStorageBackend(),
  });
}

export async function PUT(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: ProfileContent;
  try {
    payload = (await request.json()) as ProfileContent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || !payload.meta || !payload.hero) {
    return NextResponse.json(
      { error: "Incomplete profile payload" },
      { status: 400 }
    );
  }

  const result = await saveProfileContent(payload);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, storage: result.backend },
      { status: 503 }
    );
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true, storage: result.backend });
}
