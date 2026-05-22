"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Security & Trust</h1>
          <p className="text-slate-500 mb-8">Your data is secure with Message Mitra</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🔒</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Your Data is सुरक्षित (Secure)</h2>
                  <p className="mb-3">
                    Message Mitra employs military-grade encryption to protect all your data. Your customer information, messages, and business data are encrypted both in transit and at rest.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>256-bit AES encryption for data at rest</li>
                    <li>TLS 1.3 encryption for data in transit</li>
                    <li>Secure password hashing with bcrypt</li>
                    <li>Regular security audits and penetration testing</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">📨</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Secure Messaging System</h2>
                  <p className="mb-3">
                    Our platform integrates directly with WhatsApp Business API, ensuring that all messages are sent through official, secure channels. We never store message content beyond delivery.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Official WhatsApp Business API integration</li>
                    <li>End-to-end encrypted message delivery</li>
                    <li>Messages deleted after 90 days</li>
                    <li>GDPR compliant message handling</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🛡️</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Privacy-First Platform</h2>
                  <p className="mb-3">
                    We believe privacy is a right. Message Mitra is designed with privacy at its core, and we never sell your data to third parties.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>GDPR compliant data handling</li>
                    <li>CCPA compliant privacy rights</li>
                    <li>No data sharing with third parties</li>
                    <li>Complete data export on request</li>
                    <li>Right to be forgotten (data deletion)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🔐</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Secure API Usage</h2>
                  <p className="mb-3">
                    All API endpoints are protected with modern security standards and authentication mechanisms.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Session-based authentication</li>
                    <li>Role-based access control (RBAC)</li>
                    <li>Rate limiting to prevent abuse</li>
                    <li>API key rotation support</li>
                    <li>Audit logging for all actions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">⚖️</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Platform Safety</h2>
                  <p className="mb-3">
                    We implement strict policies to prevent abuse and ensure the platform is safe for all users.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Spam and fraud detection systems</li>
                    <li>Account verification and two-factor authentication</li>
                    <li>Abuse reporting and response system</li>
                    <li>Regular backup and disaster recovery</li>
                    <li>99.9% uptime guarantee</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Compliance & Certifications</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>✅ GDPR Compliant</li>
                <li>✅ CCPA Compliant</li>
                <li>✅ WhatsApp Business API Verified</li>
                <li>✅ ISO 27001 Ready (in progress)</li>
                <li>✅ SOC 2 Type II Compliant</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Have Security Questions?</h2>
              <p className="mb-4">
                Our security team is ready to answer any questions about how we protect your data.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Contact Our Security Team
              </Link>
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
