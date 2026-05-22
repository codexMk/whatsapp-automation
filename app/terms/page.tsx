"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500 mb-8">Last Updated: May 5, 2026</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Message Mitra, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. License</h2>
              <p>
                Message Mitra grants you a limited, non-exclusive, non-transferable license to access and use our platform for legitimate business purposes. You may not reproduce, redistribute, or transmit the platform or its content without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
              <p className="mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Use the platform only for lawful purposes</li>
                <li>Not engage in harassment, spam, or abuse of contacts</li>
                <li>Comply with all WhatsApp Business Platform policies</li>
                <li>Not send unsolicited marketing messages without consent</li>
                <li>Not use the platform to distribute malware or malicious content</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Prohibited Activities</h2>
              <p className="mb-4">
                You may not:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Send spam, phishing, or fraudulent messages</li>
                <li>Scrape or harvest contact information illegally</li>
                <li>Impersonate other businesses or individuals</li>
                <li>Violate WhatsApp's terms or Meta's policies</li>
                <li>Send messages for illegal activities or regulated industries without proper licensing</li>
                <li>Resell or distribute the platform or its features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Service Availability</h2>
              <p>
                While we strive to maintain 99.9% uptime, Message Mitra is provided on an &quot;as-is&quot; basis. We do not guarantee uninterrupted access and are not liable for service interruptions due to maintenance, updates, or technical issues beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Message Compliance</h2>
              <p className="mb-4">
                You are solely responsible for ensuring that:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You have express written consent from all message recipients</li>
                <li>Your messages comply with WhatsApp's policies</li>
                <li>You include proper opt-out mechanisms</li>
                <li>You comply with GDPR, CCPA, and local privacy laws</li>
                <li>You do not send prohibited content (adult, illegal, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Message Mitra are owned by Message Mitra, its licensors, or other providers of such material. You may not use our trademarks, logos, or content without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Payment Terms</h2>
              <div className="space-y-2">
                <p>
                  <strong>Billing Cycle:</strong> Most plans are billed monthly. Annual plans receive a discount.
                </p>
                <p>
                  <strong>Cancellation:</strong> You may cancel your subscription at any time. No refunds are provided for partial months.
                </p>
                <p>
                  <strong>Overages:</strong> If your usage exceeds plan limits, additional charges may apply.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
              <p>
                Message Mitra shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits or data loss, arising from your use of the platform or inability to access it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Message Mitra from any claims, damages, losses, or expenses arising from your violation of these terms or your use of the platform in a manner that violates applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Account Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account if you violate these terms, engage in illegal activities, or abuse the platform. Termination may result in loss of all campaign data and contact lists.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
              <p>
                These terms are governed by the laws of [Your Jurisdiction]. Any disputes shall be resolved through binding arbitration or in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Contact</h2>
              <p>
                For questions about these terms, please contact:
              </p>
              <p className="mt-2 font-bold">
                Email: legal@messagemitra.com<br/>
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
