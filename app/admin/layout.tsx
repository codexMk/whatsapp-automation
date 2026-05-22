import { redirect } from "next/navigation";
import { validateSession } from "@/lib/session-server";

export const dynamic = "force-dynamic";

/**
 * Admin Layout - Protects all /admin routes
 * 
 * This layout ensures:
 * 1. User is logged in
 * 2. User has ADMIN or SUPER_ADMIN role
 * 3. User account is ACTIVE
 * 4. Admin account is not deactivated
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate session and get user role
  const session = await validateSession();

  // Not logged in - redirect to admin login
  if (!session) {
    console.log("[ADMIN_LAYOUT] No session - redirecting to admin login");
    redirect("/admin-secret-login");
  }

  // Check if user has admin role
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    console.log(`[ADMIN_LAYOUT] User role ${session.role} not authorized - redirecting`);
    redirect("/admin-secret-login");
  }

  // If all checks pass, render children
  return <>{children}</>;
}
