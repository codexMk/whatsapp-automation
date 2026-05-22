/**
 * Verification Middleware
 * Checks user verification status and handles redirects
 */

import { db } from "@/lib/db";

export interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  isBusinessVerified: boolean;
  fullyVerified: boolean;
  nextStep: "EMAIL_VERIFICATION" | "PHONE_VERIFICATION" | "BUSINESS_VERIFICATION" | null;
}

/**
 * Get verification status for a user
 */
export async function getVerificationStatus(userId: string): Promise<VerificationStatus | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        emailVerified: true,
        phoneVerified: true,
        isBusinessVerified: true
      }
    });

    if (!user) return null;

    const fullyVerified = user.emailVerified && user.phoneVerified && user.isBusinessVerified;

    let nextStep: VerificationStatus["nextStep"] = null;
    if (!fullyVerified) {
      nextStep = !user.emailVerified
        ? "EMAIL_VERIFICATION"
        : !user.phoneVerified
        ? "PHONE_VERIFICATION"
        : "BUSINESS_VERIFICATION";
    }

    return {
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      isBusinessVerified: user.isBusinessVerified,
      fullyVerified,
      nextStep
    };
  } catch (error) {
    console.error("[GET_VERIFICATION_STATUS] Error:", error);
    return null;
  }
}

/**
 * Check if user can access dashboard
 * Returns true if fully verified, false otherwise
 */
export async function canAccessDashboard(userId: string): Promise<boolean> {
  const status = await getVerificationStatus(userId);
  return status?.fullyVerified ?? false;
}

/**
 * Get redirect path for unverified user
 */
export function getRedirectPath(verificationStatus: VerificationStatus | null): string | null {
  if (!verificationStatus || verificationStatus.fullyVerified) {
    return null; // User is verified, no redirect needed
  }

  switch (verificationStatus.nextStep) {
    case "EMAIL_VERIFICATION":
      return "/auth/verify-email";
    case "PHONE_VERIFICATION":
      return "/auth/verify-phone";
    case "BUSINESS_VERIFICATION":
      return "/onboarding/business";
    default:
      return "/auth/verify-email"; // Default fallback
  }
}

/**
 * Require verification middleware
 * Use this in protected routes
 */
export async function requireVerification(userId: string) {
  const status = await getVerificationStatus(userId);

  if (!status?.fullyVerified) {
    const redirectPath = getRedirectPath(status);
    return {
      verified: false,
      redirectPath,
      status
    };
  }

  return {
    verified: true,
    redirectPath: null,
    status
  };
}
