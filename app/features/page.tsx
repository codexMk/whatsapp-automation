"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";

const features = [
  {
    id: 1,
    title: "WhatsApp Automation",
    description: "Automate your WhatsApp messages and reach customers at scale without manual effort",
    icon: "🤖"
  },
  {
    id: 2,
    title: "Broadcast Campaigns",
    description: "Send targeted campaigns to customer segments with personalized messages",
    icon: "📢"
  },
  {
    id: 3,
    title: "Ready-Made Templates",
    description: "Use industry-specific templates for clinics, shops, real estate, coaching, and more",
    icon: "📝"
  },
  {
    id: 4,
    title: "Customer Management",
    description: "Organize and segment your customers with tags, groups, and custom fields",
    icon: "👥"
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    description: "Real-time insights into campaign performance, delivery rates, and customer engagement",
    icon: "📊"
  },
  {
    id: 6,
    title: "Admin Control",
    description: "Powerful admin panel to manage users, platforms, and monitor system health",
    icon: "⚙️"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Powerful Features Built for Your Business
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Message Mitra gives you everything you need to automate WhatsApp communications and grow your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-slate-200"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses already using Message Mitra to automate their WhatsApp communications.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/category-select"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:underline font-bold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
