import { PortfolioShell } from "@/components/PortfolioShell";
import { getGitHubTelemetry } from "@/lib/github";
import { getProfileContent } from "@/lib/profile-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getProfileContent();
  const telemetry = await getGitHubTelemetry(content.meta.githubUsername);

  return <PortfolioShell content={content} telemetry={telemetry} />;
}
