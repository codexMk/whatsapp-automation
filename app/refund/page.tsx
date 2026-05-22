"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Refund Policy</h1>
          <p className="text-slate-500 mb-8">Last Updated: May 5, 2026</p>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">30-Day Money-Back Guarantee</h2>
              <p>
                We offer a 30-day money-back guarantee for your first subscription period. If you're not satisfied with Message Mitra, simply request a refund within 30 days of your initial purchase, and we'll refund 100% of your subscription fee.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Request a Refund</h2>
              <p className="mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Log into your Message Mitra account</li>
                <li>Go to Settings &gt; Billing</li>
                <li>Click &quot;Request Refund&quot;</li>
                <li>Provide the reason for your refund request</li>
                <li>Submit the form</li>
              </ol>
              <p className="mt-4">
                Our support team will process your request within 2 business days. Refunds are typically processed within 5-7 business days to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Refund Eligibility</h2>
              <p className="mb-4">
                Your refund request is eligible if:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You request the refund within 30 days of purchase</li>
                <li>This is your first subscription or upgrade</li>
                <li>Your account is in good standing (no violations of ToS)</li>
                <li>You have not used promotional credits or discounts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Non-Refundable Items</h2>
              <p className="mb-4">
                The following items are non-refundable:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Subscription renewals after the initial 30-day period</li>
                <li>Usage-based overage charges</li>
                <li>Custom development or consulting services</li>
                <li>Refunds requested more than 30 days after purchase</li>
                <li>Subscriptions purchased with promotional codes (unless stated otherwise)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Upgrades and Downgrades</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Upgrade</h3>
                  <p>
                    If you upgrade within 30 days, the original subscription amount is still protected under the 30-day guarantee. You'll be refunded the full original amount if you request a refund.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Downgrade</h3>
                  <p>
                    If you downgrade to a cheaper plan, the difference is not refunded. You can cancel anytime and maintain access until the end of your billing cycle.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cancellation</h2>
              <p className="mb-4">
                If you do not request a refund within 30 days, your subscription will continue to renew automatically on your billing date. You can cancel your subscription anytime:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to Settings &gt; Billing &gt; Subscription</li>
                <li>Click &quot;Cancel Subscription&quot;</li>
                <li>Confirm cancellation</li>
              </ol>
              <p className="mt-4">
                You'll retain access to your account until the end of the current billing cycle. No refunds are provided for partial months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Annual Plans</h2>
              <p>
                Annual subscriptions also qualify for the 30-day money-back guarantee. If you purchased an annual plan and request a refund within 30 days, you'll receive a full refund of the annual subscription fee.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Disputed Charges</h2>
              <p>
                If you notice a charge on your card that you don't recognize or believe is incorrect, please contact our billing team immediately at billing@messagemitra.com with details of the transaction. We'll investigate and correct any billing errors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Refunds for Suspended Accounts</h2>
              <p>
                If your account is suspended due to violation of our Terms of Service, refunds may not be provided. However, if the suspension is determined to be in error, we will consider refund requests on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Support</h2>
              <p className="mb-4">
                For refund-related questions or to initiate a refund request:
              </p>
              <p className="font-bold">
                Email: billing@messagemitra.com<br/>
                Phone: +91-XXXX-XXXX-XXXX<br/>
                Support Hours: Monday - Friday, 9 AM - 6 PM IST
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
