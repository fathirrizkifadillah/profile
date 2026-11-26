import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin-auth";
import { detectStorageBackend, getProfileContent } from "@/lib/profile-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return <AdminLoginForm isPasswordConfigured={Boolean(getAdminPassword())} />;
  }

  const content = await getProfileContent();
  const storageBackend = detectStorageBackend();

  return (
    <AdminDashboard
      initialContent={content}
      storageBackend={storageBackend}
    />
  );
}
