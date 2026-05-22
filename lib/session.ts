// Utility functions for session handling
import crypto from "crypto";

const SESSION_COOKIE_NAME = "wa_session";
const SESSION_TTL_DAYS = 7;

type SessionPayload = {
  userId: string;
  exp: number;
};

function getAppSecret(): string {
  const secret = process.env.APP_SECRET;
  if (!secret) {
    throw new Error("APP_SECRET is not set");
  }
  return secret;
}

function signSession(payload: SessionPayload): string {
  const secret = getAppSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  const signature = hmac.digest("base64url");
  return `${data}.${signature}`;
}

function verifySession(token: string): SessionPayload | null {
  const secret = getAppSecret();
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  const expectedSignature = hmac.digest("base64url");
  const providedSignature = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(providedSignature, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;

    if (typeof payload.userId !== "string" || typeof payload.exp !== "number") {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Helper to sign a session for a userId (not recursive)
function signSessionToken(userId: string): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_TTL_DAYS * 24 * 60 * 60;
  return signSession({ userId, exp });
}

export { signSession, signSessionToken, verifySession };

