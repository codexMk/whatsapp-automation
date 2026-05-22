"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Component that checks if user is verified
 * Redirects to onboarding if not
 *
 * NOTE: This component is minimal and performs check only once on mount.
 * It prevents infinite redirect loops by carefully managing state and pathnames.
 */
export function VerificationCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip check if already on auth pages or onboarding
    if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/(auth)") || pathname === "/login" || pathname === "/signup") {
      setIsChecking(false);
      return;
    }

    let mounted = true;

    const checkVerification = async () => {
      try {
        const response = await fetch("/api/user/me", {
          cache: 'no-store',
          next: { revalidate: 0 }
        });

        if (!response.ok) {
          if (mounted) {
            router.push("/login");
          }
          return;
        }

        const data = await response.json();
        if (!data.success || !data.user) {
          if (mounted) {
            router.push("/login");
          }
          return;
        }

        const user = data.user;
        const isFullyVerified = user.emailVerified && user.phoneVerified && user.isBusinessVerified;

        // Redirect to onboarding only if not verified
        if (!isFullyVerified && mounted) {
          router.push("/onboarding/business-verification");
          return;
        }

        if (mounted) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Verification check error:", error);
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    checkVerification();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying your account...</p>
        </div>
      </div>
    );
  }

  return null;
}
