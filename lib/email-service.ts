/**
 * Email Service using Nodemailer
 * Sends OTP and verification emails
 */

import nodemailer from "nodemailer";

// Create transporter (using Gmail or your email service)
// In production, use environment variables for credentials
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via nodemailer
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email service not configured. Skipping email send.");
      return true; // Return true to allow development without email service
    }

    const result = await transporter.sendMail({
      from: `Message Mitra <${process.env.EMAIL_USER}>`,
      ...options
    });

    console.log(`✅ Email sent to ${options.to}:`, result.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Message Mitra</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
      </div>

      <div style="padding: 40px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Hello,
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          Your OTP for Message Mitra is:
        </p>

        <div style="background: white; border: 2px solid #667eea; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 2px;">
            ${otp}
          </p>
        </div>

        <p style="font-size: 12px; color: #999; margin: 20px 0 0 0;">
          ⏱️ This OTP is valid for 5 minutes only.
        </p>

        <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
          If you didn't request this OTP, please ignore this email.
        </p>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #999;">
        <p style="margin: 0;">© 2026 Message Mitra. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Your Message Mitra OTP - Valid for 5 minutes",
    html
  });
}

/**
 * Send verification confirmation email
 */
export async function sendVerificationConfirmationEmail(
  email: string,
  name: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Message Mitra</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Verification Successful</p>
      </div>

      <div style="padding: 40px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Hello ${name},
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          ✅ Your email has been verified successfully!
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          You're one step away from accessing Message Mitra. Please complete your business verification to start sending campaigns.
        </p>

        <a href="${process.env.APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          Go to Dashboard
        </a>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #999;">
        <p style="margin: 0;">© 2026 Message Mitra. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to Message Mitra - Email Verified!",
    html
  });
}

/**
 * Send business verification confirmation email
 */
export async function sendBusinessVerifiedEmail(
  email: string,
  businessName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Message Mitra</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Account Activated!</p>
      </div>

      <div style="padding: 40px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Congratulations!
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          Your business verification for <strong>${businessName}</strong> has been completed successfully.
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          Your account is now fully activated. You can start sending WhatsApp campaigns immediately!
        </p>

        <a href="${process.env.APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          Start Sending Now
        </a>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #999;">
        <p style="margin: 0;">© 2026 Message Mitra. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "✅ Business Verified - Account Activated!",
    html
  });
}

/**
 * Send password reset email with reset link
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  expiryMinutes: number = 30
): Promise<boolean> {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Message Mitra</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
      </div>

      <div style="padding: 40px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Hello,
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          We received a request to reset your Message Mitra password. Click the button below to reset it.
        </p>

        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 12px; color: #999; margin: 20px 0 0 0;">
          ⏱️ This link is valid for ${expiryMinutes} minutes only.
        </p>

        <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
          If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>

        <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
          For security reasons, never share this link with anyone.
        </p>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #999;">
        <p style="margin: 0;">© 2026 Message Mitra. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Message Mitra Password",
    html
  });
}

/**
 * Send password changed confirmation email
 */
export async function sendPasswordChangedEmail(email: string): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Message Mitra</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Changed</p>
      </div>

      <div style="padding: 40px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Hello,
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          ✅ Your password has been successfully changed!
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
          If you did not make this change, please contact our support team immediately.
        </p>

        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL}/login" style="display: inline-block; background: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Go to Login
          </a>
        </div>

        <p style="font-size: 12px; color: #999; margin: 20px 0 0 0;">
          Stay secure: Never share your password with anyone.
        </p>
      </div>

      <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 11px; color: #999;">
        <p style="margin: 0;">© 2026 Message Mitra. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "✅ Your Password Has Been Changed",
    html
  });
}
