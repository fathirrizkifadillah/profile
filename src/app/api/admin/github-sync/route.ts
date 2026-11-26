import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getGitHubTelemetry } from "@/lib/github";
import { getProfileContent } from "@/lib/profile-store";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getProfileContent();
  const telemetry = await getGitHubTelemetry(content.meta.githubUsername, true);
  return NextResponse.json({ telemetry });
}
