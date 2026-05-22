"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 mb-8">Last Updated: May 5, 2026</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                At Message Mitra, we are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Personal Information</h3>
                  <p>
                    We collect information you provide directly, such as your name, email address, phone number, business name, and account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">WhatsApp Data</h3>
                  <p>
                    To facilitate messaging campaigns, we securely process WhatsApp messages, contact lists, and conversation metadata. We do not store personal messages beyond the duration required to deliver them.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Usage Data</h3>
                  <p>
                    We automatically collect information about your interactions with our platform, including IP address, browser type, pages visited, and time spent on features.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide, maintain, and improve our services</li>
                <li>To process campaigns and deliver messages via WhatsApp</li>
                <li>To communicate with you about your account and service updates</li>
                <li>To analyze usage patterns and optimize platform performance</li>
                <li>To comply with legal obligations and prevent fraud</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. WhatsApp and Meta Compliance</h2>
              <p className="mb-4">
                Message Mitra is committed to compliance with WhatsApp's Business Platform policies and Meta's data policies. Specifically:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>We only process messages in accordance with WhatsApp Business API terms</li>
                <li>We respect WhatsApp's message templates and business account requirements</li>
                <li>We comply with Meta's privacy and data sharing standards</li>
                <li>Your WhatsApp contacts are processed securely and never sold to third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement industry-standard security measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure server infrastructure with regular security audits</li>
                <li>Role-based access controls for staff members</li>
                <li>PCI compliance for payment information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active. Deleted account data is purged from our systems within 30 days. WhatsApp message logs are retained for 90 days for compliance and support purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Sharing Your Information</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>WhatsApp/Meta (to process messages on your behalf)</li>
                <li>Service providers who assist in platform operation</li>
                <li>Legal authorities if required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access and download your personal data</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your campaign data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
              <p>
                For privacy-related inquiries, please contact us at:
              </p>
              <p className="mt-2 font-bold">
                Email: privacy@messagemitra.com<br/>
                Address: [Your Business Address]
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link href="/" className="text-blue-600 hover:underline font-bold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
