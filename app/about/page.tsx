"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">About Message Mitra</h1>
          <p className="text-lg text-slate-600 mb-8 italic">Smart WhatsApp Automation for Local Businesses</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p>
                Message Mitra empowers small and medium-sized businesses to automate their WhatsApp communications, save time, and grow their customer base. We believe that automation should be accessible, affordable, and easy to use—not just for tech giants, but for every business owner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Who We Are</h2>
              <p>
                Message Mitra is a SaaS platform built by entrepreneurs who understand the challenges of managing customer communications at scale. Our team combines expertise in WhatsApp Business API, automation, and customer experience to deliver a platform that truly works for local businesses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What We Do</h2>
              <p className="mb-4">
                Message Mitra helps businesses:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Send campaigns at scale</strong> - Reach hundreds or thousands of customers with a single click</li>
                <li><strong>Automate responses</strong> - Set up automated messages for common inquiries</li>
                <li><strong>Schedule messages</strong> - Send campaigns at the perfect time for your audience</li>
                <li><strong>Manage templates</strong> - Pre-built and custom message templates for your industry</li>
                <li><strong>Track analytics</strong> - Real-time insights into campaign performance and customer engagement</li>
                <li><strong>Manage contacts</strong> - Organize customers by segment and send targeted campaigns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Message Mitra?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-bold text-slate-900 mb-2">🚀 Easy to Use</h3>
                  <p>
                    No coding required. Intuitive interface designed for business owners, not engineers.
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-bold text-slate-900 mb-2">💰 Affordable</h3>
                  <p>
                    Transparent pricing with no hidden fees. Scale from startup to enterprise.
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-bold text-slate-900 mb-2">🔒 Secure & Compliant</h3>
                  <p>
                    WhatsApp Business API verified. GDPR and data privacy compliant.
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-bold text-slate-900 mb-2">🤝 24/7 Support</h3>
                  <p>
                    Dedicated support team ready to help you succeed with WhatsApp automation.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">For Your Industry</h2>
              <p className="mb-4">
                Message Mitra caters to a wide range of businesses:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Clinics & Healthcare</strong> - Appointment reminders, health tips, patient engagement</li>
                <li><strong>Retail & E-Commerce</strong> - Product launches, order updates, customer service</li>
                <li><strong>Real Estate</strong> - Property notifications, viewing updates, client inquiries</li>
                <li><strong>Coaching & Training</strong> - Session reminders, course updates, student engagement</li>
                <li><strong>CSC & Government Services</strong> - Citizen notifications, service updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment</h2>
              <p className="mb-4">
                We are committed to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Security & Privacy</strong> - Your data is encrypted and protected with industry standards</li>
                <li><strong>Compliance</strong> - Full WhatsApp Business API compliance and GDPR adherence</li>
                <li><strong>Innovation</strong> - Continuous feature development based on customer feedback</li>
                <li><strong>Support</strong> - Responsive customer support and detailed documentation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Started Today</h2>
              <p>
                Ready to transform your business communication? Sign up for a free 30-day trial and experience the power of Message Mitra. No credit card required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="mb-4">
                  <strong>Email:</strong> info@messagemitra.com<br/>
                  <strong>Phone:</strong> +91-XXXX-XXXX-XXXX<br/>
                  <strong>Address:</strong> [Your Business Address]<br/>
                  <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM IST
                </p>
                <p className="text-sm text-slate-600">
                  For support requests, please visit our help center or contact support@messagemitra.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Follow Us</h2>
              <p>
                Stay updated with the latest features and tips:
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-blue-600 hover:underline font-bold">Facebook</a>
                <a href="#" className="text-blue-600 hover:underline font-bold">Twitter/X</a>
                <a href="#" className="text-blue-600 hover:underline font-bold">LinkedIn</a>
                <a href="#" className="text-blue-600 hover:underline font-bold">Instagram</a>
              </div>
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
