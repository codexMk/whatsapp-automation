"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const translations = {
  en: {
    welcomeBack: "Welcome Back",
    signIn: "Sign in to your account to continue",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "••••••••",
    signInBtn: "Sign In",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    forgotPassword: "Forgot password?",
    showPassword: "Show",
    hidePassword: "Hide",
    secure: "Secure",
    instantAccess: "Instant Access",
    freeTrial: "Free Trial",
    crazyMsg: "🚀 Send 1000s of messages in seconds!"
  },
  mr: {
    welcomeBack: "स्वागत आहे",
    signIn: "आपल्या खाते मध्ये साइन इन करा",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    signInBtn: "साइन इन करा",
    signingIn: "साइन इन करत आहे...",
    noAccount: "खाते नाही?",
    signUp: "साइन अप करा",
    forgotPassword: "पासवर्ड विसरलात?",
    showPassword: "दाखवा",
    hidePassword: "लपवा",
    secure: "सुरक्षित",
    instantAccess: "तात्क्षणिक प्रवेश",
    freeTrial: "विनामूल्य चाचणी",
    crazyMsg: "💬 सेकंदांमध्ये हजारो संदेश पाठवा!"
  },
  hi: {
    welcomeBack: "स्वागत है",
    signIn: "अपने खाते में साइन इन करें",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    signInBtn: "साइन इन करें",
    signingIn: "साइन इन कर रहे हैं...",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप करें",
    forgotPassword: "पासवर्ड भूल गए?",
    showPassword: "दिखाएं",
    hidePassword: "छिपाएं",
    secure: "सुरक्षित",
    instantAccess: "तत्काल पहुंच",
    freeTrial: "मुफ्त परीक्षण",
    crazyMsg: "🔥 सेकंड में हजारों संदेश भेजें!"
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const t = translations[language];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to log in with those credentials.");
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      router.push(data.redirectUrl || "/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

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
          <div>
            <h2 className="text-3xl font-black text-slate-900">{t.welcomeBack}</h2>
            <p className="mt-2 text-slate-600">{t.signIn}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              {isSubmitting ? t.signingIn : t.signInBtn}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-medium">{t.noAccount}</span>
            </div>
          </div>

          <Link
            href="/category-select"
            className="w-full flex items-center justify-center rounded-lg border-2 border-blue-600 px-4 py-3 text-lg font-black text-blue-600 hover:bg-blue-50 transition-all-smooth"
          >
            {t.signUp}
          </Link>

          <div className="pt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              {t.forgotPassword}
            </Link>
          </div>
        </div>

        {/* Trust badges with crazy emoji */}
        <div className="mt-8 flex justify-center gap-6 text-white/90 text-sm font-bold">
          <div className="flex items-center gap-1">✓ {t.secure}</div>
          <div className="flex items-center gap-1">⚡ {t.instantAccess}</div>
          <div className="flex items-center gap-1">🎁 {t.freeTrial}</div>
        </div>

        {/* Crazy Easter Egg Message */}
        <div className="mt-10 text-center text-white/80 text-xs animate-pulse">
          <p>💬 Pro Tip: You can send messages at 3 AM and still be professional! 😄</p>
        </div>
      </div>
    </main>
  );
}

