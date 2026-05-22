const requiredEnv = [
  'DATABASE_URL',
  'APP_SECRET',
  'WHATSAPP_API_KEY'
];

export function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
