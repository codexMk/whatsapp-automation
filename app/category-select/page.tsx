"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CATEGORIES = {
  clinic: {
    title: "Clinic",
    description: "Appointment reminders, health tips, patient engagement",
    icon: "🏥",
    features: [
      "Appointment reminders",
      "Health tips and updates",
      "Patient feedback",
      "Emergency alerts"
    ]
  },
  shop: {
    title: "Shop",
    description: "Product updates, sales, customer notifications",
    icon: "🛍️",
    features: [
      "New product alerts",
      "Flash sales",
      "Order updates",
      "Inventory alerts"
    ]
  },
  "real-estate": {
    title: "Real Estate",
    description: "Property listings, viewing updates, client inquiries",
    icon: "🏠",
    features: [
      "Property updates",
      "Viewing schedules",
      "Lead inquiries",
      "Market insights"
    ]
  },
  coaching: {
    title: "Coaching",
    description: "Session reminders, progress updates, announcements",
    icon: "💪",
    features: [
      "Session reminders",
      "Progress updates",
      "New program announcements",
      "Member engagement"
    ]
  },
  csc: {
    title: "CSC",
    description: "Service notifications, citizen engagement",
    icon: "🏛️",
    features: [
      "Service updates",
      "Event notifications",
      "Citizen feedback",
      "Community alerts"
    ]
  }
};

function CategorySelectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get("category") as keyof typeof CATEGORIES;

  const category = selectedCategory ? CATEGORIES[selectedCategory] : null;

  if (!category) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
          <div className="px-6 py-4">
            <Link href="/" className="text-white hover:text-blue-100 font-bold text-lg">
              ← Back to Home
            </Link>
          </div>
        </header>

        <div className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-4">
                Choose Your Industry
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Get industry-specific templates and automations designed just for your business
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-stagger">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => router.push(`/category-select?category=${key}`)}
                  className="group text-left rounded-2xl border-2 border-white bg-gradient-to-br from-blue-600 to-blue-700 p-8 transition-all-smooth hover:border-blue-300 hover:shadow-2xl hover:scale-105 animate-scale-in text-white"
                >
                  <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">{cat.icon}</div>
                  <h3 className="text-2xl font-black text-white mb-2">{cat.title}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">{cat.description}</p>
                  <div className="mt-4 text-blue-600 font-bold group-hover:text-blue-700">
                    Get Started →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-100 font-bold text-lg flex items-center gap-2">
            ← Home
          </Link>
          <Link href="/category-select" className="text-white hover:text-blue-100 font-bold text-lg">
            ← Choose Different Category
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Category Header */}
          <div className="text-center mb-12 animate-fade-in text-white">
            <div className="text-8xl mb-6 animate-bounce">{category.icon}</div>
            <h1 className="text-5xl sm:text-6xl font-black mb-4">
              {category.title}
            </h1>
            <p className="text-xl text-blue-100">
              {category.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 shadow-2xl mb-8 animate-slide-up text-white">
            <h2 className="text-3xl font-black text-white mb-8">
              What You'll Get
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {category.features.map((feature, idx) => (
                <div key={feature} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="text-3xl">✨</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{feature}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crazy Feature - Category Specific */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 animate-slide-up text-white border-2 border-white/30">
            <div className="flex gap-4 items-start">
              <div className="text-4xl">🚀</div>
              <div>
                <h3 className="font-black text-xl mb-2">Crazy Feature: Smart Scheduling</h3>
                <p className="text-white/90">Our AI learns the best time to send messages to your {category.title.toLowerCase()} customers and automatically optimizes delivery times. You never have to think about it!</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 animate-slide-up">
            <button
              onClick={() => {
                // Store category in sessionStorage
                sessionStorage.setItem("selectedCategory", selectedCategory);
                router.push("/signup");
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:bg-blue-700 py-4 text-lg font-black rounded-2xl hover:shadow-2xl transition-all-smooth hover:scale-105"
            >
              Continue to Sign Up 🚀
            </button>
            <button
              onClick={() => router.push("/category-select")}
              className="w-full rounded-2xl border-2 border-white bg-transparent px-6 py-4 font-black text-white text-lg transition-all-smooth hover:bg-white/10"
            >
              Choose Different Category
            </button>
          </div>

          {/* Trust Section */}
          <div className="mt-12 text-center text-white/80">
            <p className="text-sm font-medium">
              ✓ 30-day free trial • ✓ No credit card • ✓ All features included
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function CategorySelectFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-black text-slate-900">Loading categories...</h1>
      </div>
    </main>
  );
}

export default function CategorySelectPage() {
  return (
    <Suspense fallback={<CategorySelectFallback />}>
      <CategorySelectContent />
    </Suspense>
  );
}
