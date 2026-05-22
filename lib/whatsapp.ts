import { db } from "./db";

export type SendWhatsAppMessageParams = {
  phone: string;
  message: string;
  userId: string;
  templateId?: string;
};

export type SendWhatsAppMessageResult = {
  success: boolean;
  error?: string;
  logId?: string;
};

export async function sendWhatsAppMessage({ phone, message, userId, templateId }: SendWhatsAppMessageParams): Promise<SendWhatsAppMessageResult> {
  // Placeholder: Simulate WhatsApp Cloud API call
  const apiKey = process.env.WHATSAPP_API_KEY;
  if (!apiKey) {
    return { success: false, error: "WhatsApp API key not configured" };
  }

  // Log message in MessageLog (multi-tenant safe)
  try {
    const log = await db.messageLog.create({
      data: {
        userId,
        toPhone: phone,
        content: message,
        templateId,
        status: "SENT"
      }
    });
    return { success: true, logId: log.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to log WhatsApp message"
    };
  }
}
