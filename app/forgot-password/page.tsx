"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const translations = {
  en: {
    forgotPasswordTitle: "Forgot Password",
    forgotPasswordDesc: "Enter your email address and we'll send you a link to reset your password",
    email: "Email",
    emailPlaceholder: "you@example.com",
    sendResetLinkBtn: "Send Reset Link",
    sendingResetLink: "Sending...",
    backToLogin: "Back to Login",
    success: "✅ Password reset link sent! Check your email.",
    error: "Unable to send reset link. Please try again.",
    noAccount: "Don't have an account?",
    signUp: "Sign Up"
  },
  mr: {
    forgotPasswordTitle: "पासवर्ड विसरलात?",
    forgotPasswordDesc: "आपले ईमेल पत्ता प्रविष्ट करा आणि आम्ही आपल्याला पासवर्ड रीसेट करण्याचा लिंक पाठवू",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    sendResetLinkBtn: "रीसेट लिंक पाठवा",
    sendingResetLink: "पाठवत आहे...",
    backToLogin: "लॉगिन ला परत",
    success: "✅ पासवर्ड रीसेट लिंक पाठवले गेले! आपल्या ईमेल तपासा.",
    error: "रीसेट लिंक पाठवू शकत नाही. कृपया पुन्हा प्रयत्न करा.",
    noAccount: "खाते नाही?",
    signUp: "साइन अप करा"
  },
  hi: {
    forgotPasswordTitle: "पासवर्ड भूल गए?",
    forgotPasswordDesc: "अपना ईमेल पता दर्ज करें और हम आपको पासवर्ड रीसेट करने के लिए एक लिंक भेजेंगे",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    sendResetLinkBtn: "रीसेट लिंक भेजें",
    sendingResetLink: "भेज रहे हैं...",
    backToLogin: "लॉगिन पर वापस जाएं",
    success: "✅ पासवर्ड रीसेट लिंक भेज दिया गया! अपना ईमेल जांचें।",
    error: "रीसेट लिंक भेजने में असमर्थ। कृपया पुन: प्रयास करें।",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप करें"
  }
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const t = translations[language];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error || t.error
        });
        setIsSubmitting(false);
        return;
      }

      setMessage({
        type: "success",
        text: t.success
      });
      setEmail("");
      setIsSubmitting(false);
    } catch {
      setMessage({
        type: "error",
        text: t.error
      });
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
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all font-bold"
        >
          ← {t.backToLogin}
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2 inline-block">🔐</div>
          <h1 className="text-3xl font-black text-white">Message Mitra</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{t.forgotPasswordTitle}</h2>
            <p className="mt-2 text-slate-600">{t.forgotPasswordDesc}</p>
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
                disabled={isSubmitting}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {message && (
              <p
                className={`rounded-lg p-3 text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-lg font-black hover:shadow-lg transition-all-smooth"
              disabled={isSubmitting}
            >
              {isSubmitting ? t.sendingResetLink : t.sendResetLinkBtn}
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
        </div>
      </div>
    </main>
  );
}
