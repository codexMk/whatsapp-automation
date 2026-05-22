/**
 * OTP Generation and Validation Utilities
 */

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry time (5 minutes from now)
 */
export function getOTPExpiryTime(minutesFromNow: number = 5): Date {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + minutesFromNow);
  return expiryTime;
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian phone number (+91 format)
 * Accepts: +91 9999999999, 919999999999, 9999999999
 */
export function validateIndianPhone(phone: string): boolean {
  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, "");

  // Check if it's 10 digits (without country code) or 12 digits (with country code)
  if (cleanPhone.length === 10) {
    return /^[6-9]\d{9}$/.test(cleanPhone);
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    return /^91[6-9]\d{9}$/.test(cleanPhone);
  }

  return false;
}

/**
 * Normalize Indian phone number to +91XXXXXXXXXX format
 */
export function normalizeIndianPhone(phone: string): string {
  let cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith("91")) {
    // Handle case where + is already there
    return `+${cleanPhone}`;
  }

  // Return as-is if we can't normalize
  return phone;
}

/**
 * Format phone for display (e.g., +91 9999999999)
 */
export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizeIndianPhone(phone);
  const cleanPhone = normalized.replace(/\D/g, "");

  if (cleanPhone.length === 12) {
    return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
  }

  return normalized;
}
