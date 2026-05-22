"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = {
  clinic: { title: "Clinic", icon: "🏥" },
  shop: { title: "Shop", icon: "🛍️" },
  "real-estate": { title: "Real Estate", icon: "🏠" },
  coaching: { title: "Coaching", icon: "💪" },
  csc: { title: "CSC", icon: "🏛️" }
};

const translations = {
  en: {
    createAccount: "Create Account",
    joinThousands: "Join thousands using Message Mitra",
    businessName: "Business Name",
    businessNamePlaceholder: "e.g. Sunrise Dental Clinic",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    passwordHint: "Min 8 characters, numbers and symbols",
    createAccountBtn: "Create Account",
    creating: "Creating...",
    alreadyHaveAccount: "Already have account?",
    signIn: "Sign In",
    termsText: "By signing up, you agree to our",
    termsLink: "Terms of Service",
    selectedCategory: "Selected Category",
    change: "Change",
    showPassword: "Show",
    hidePassword: "Hide",
    crazyMsg: "🎯 Say goodbye to manual texting! Automate like a pro 💪"
  },
  mr: {
    createAccount: "खाते तयार करा",
    joinThousands: "हजारो लोक मेसेज मित्र वापरत आहेत",
    businessName: "व्यावसायिक नाव",
    businessNamePlaceholder: "उदा. Sunrise Dental Clinic",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    passwordHint: "किमान 8 वर्ण, संख्या आणि चिन्हे",
    createAccountBtn: "खाते तयार करा",
    creating: "तयार करत आहे...",
    alreadyHaveAccount: "आधीच खाते आहे?",
    signIn: "साइन इन करा",
    termsText: "साइन अप करून तुम्ही आमच्या यास मान्यता देत आहात",
    termsLink: "सेवा अटी",
    selectedCategory: "निवडलेली श्रेणी",
    change: "बदला",
    showPassword: "दाखवा",
    hidePassword: "लपवा",
    crazyMsg: "📱 हस्तलिखित संदेशांचे अलविदा! प्रो सारखे ऑटोमेट करा 🚀"
  },
  hi: {
    createAccount: "खाता बनाएं",
    joinThousands: "हजारों लोग मैसेज मित्र का उपयोग कर रहे हैं",
    businessName: "व्यावसायिक नाम",
    businessNamePlaceholder: "उदा. Sunrise Dental Clinic",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    passwordHint: "कम से कम 8 वर्ण, संख्या और प्रतीक",
    createAccountBtn: "खाता बनाएं",
    creating: "बना रहे हैं...",
    alreadyHaveAccount: "पहले से खाता है?",
    signIn: "साइन इन करें",
    termsText: "साइन अप करके, आप हमारे सहमत हैं",
    termsLink: "सेवा की शर्तें",
    selectedCategory: "चयनित श्रेणी",
    change: "बदलें",
    showPassword: "दिखाएं",
    hidePassword: "छिपाएं",
    crazyMsg: "💬 मैनुअल टेक्स्टिंग को अलविदा कहें! प्रो की तरह स्वचालित करें 💪"
  }
};

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const t = translations[language];

  useEffect(() => {
    setMounted(true);
    // Load category after mount
    try {
      const stored = sessionStorage.getItem("selectedCategory");
      if (stored) {
        setSelectedCategory(stored);
      }
    } catch (e) {
      // sessionStorage not available
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          businessName: businessName || undefined,
          email,
          password,
          category: selectedCategory || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to create account with those details.");
        setIsSubmitting(false);
        return;
      }

      // Session cookie is set by the API route; redirect to dashboard.
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (!mounted) {
    return null;
  }

  const category = selectedCategory ? CATEGORIES[selectedCategory as keyof typeof CATEGORIES] : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 right-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>

      {/* Navigation Bar */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all font-bold"
        >
          ← Home
        </Link>
      </div>

      {/* Language Selector - Top Right */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        {["en", "mr", "hi"].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang as "en" | "mr" | "hi")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              language === lang
                ? "bg-white text-blue-600 shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo with crazy animation */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2 inline-block animate-bounce">⚡</div>
          <h1 className="text-3xl font-black text-white">Message Mitra</h1>
          <p className="text-lg text-white/90 mt-3 font-bold animate-pulse">{t.crazyMsg}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Category Display */}
          {category && (
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-2 border-blue-200">
              <span className="text-3xl">{category.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-600 uppercase">{t.selectedCategory}</p>
                <p className="font-bold text-slate-900">{category.title}</p>
              </div>
              <button
                onClick={() => router.push("/category-select")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
              >
                {t.change}
              </button>
            </div>
          )}

          <div>
            <h2 className="text-3xl font-black text-slate-900">{t.createAccount}</h2>
            <p className="mt-2 text-slate-600">{t.joinThousands}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                {t.businessName}
              </label>
              <Input
                name="businessName"
                placeholder={t.businessNamePlaceholder}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">{t.email}</label>
              <Input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-900">{t.password}</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showPassword ? t.hidePassword : t.showPassword}
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t.passwordPlaceholder}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500">{t.passwordHint}</p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-lg font-black hover:shadow-lg transition-all-smooth"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.creating : t.createAccountBtn}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-medium">{t.alreadyHaveAccount}</span>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full flex items-center justify-center rounded-lg border-2 border-blue-600 px-4 py-3 text-lg font-black text-blue-600 hover:bg-blue-50 transition-all-smooth"
          >
            {t.signIn}
          </Link>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-500">
              {t.termsText}{" "}
              <a href="#" className="font-bold text-blue-600 hover:text-blue-700">
                {t.termsLink}
              </a>
            </p>
          </div>
        </div>

        {/* Trust badges with emojis */}
        <div className="mt-8 flex justify-center gap-6 text-white/90 text-sm font-bold">
          <div className="flex items-center gap-1">✓ 30-Day Free</div>
          <div className="flex items-center gap-1">💳 No Card Needed</div>
          <div className="flex items-center gap-1">❌ Cancel Anytime</div>
        </div>

        {/* Crazy Easter Egg */}
        <div className="mt-10 text-center text-white/80 text-xs animate-pulse">
          <p>🎉 Fun fact: You can schedule messages while sleeping! Sleep automation ftw 😴</p>
        </div>
      </div>
    </main>
  );
}

