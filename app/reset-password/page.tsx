"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const translations = {
  en: {
    resetPasswordTitle: "Reset Password",
    resetPasswordDesc: "Enter your new password below",
    password: "New Password",
    passwordPlaceholder: "••••••••",
    passwordHint: "Min 8 characters, numbers and symbols",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "••••••••",
    resetBtn: "Reset Password",
    resetting: "Resetting...",
    backToLogin: "Back to Login",
    success: "✅ Password reset successfully! Redirecting to login...",
    error: "Unable to reset password. Please try again.",
    invalidToken: "❌ Invalid or expired reset link. Please request a new one.",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 8 characters",
    showPassword: "Show",
    hidePassword: "Hide"
  },
  mr: {
    resetPasswordTitle: "पासवर्ड रीसेट करा",
    resetPasswordDesc: "खाली आपला नवीन पासवर्ड प्रविष्ट करा",
    password: "नवीन पासवर्ड",
    passwordPlaceholder: "••••••••",
    passwordHint: "किमान 8 वर्ण, संख्या आणि चिन्हे",
    confirmPassword: "पासवर्ड पुष्टी करा",
    confirmPasswordPlaceholder: "••••••••",
    resetBtn: "पासवर्ड रीसेट करा",
    resetting: "रीसेट करत आहे...",
    backToLogin: "लॉगिन ला परत",
    success: "✅ पासवर्ड यशस्वीरित्या रीसेट झाले! लॉगिन करत आहे...",
    error: "पासवर्ड रीसेट करू शकत नाही. कृपया पुन्हा प्रयत्न करा.",
    invalidToken: "❌ अमान्य किंवा कालबाह्य रीसेट लिंक. कृपया नवीन विनंती करा.",
    passwordMismatch: "पासवर्ड जुळत नाहीत",
    passwordTooShort: "पासवर्ड किमान 8 वर्णांचा असणे आवश्यक आहे",
    showPassword: "दाखवा",
    hidePassword: "लपवा"
  },
  hi: {
    resetPasswordTitle: "पासवर्ड रीसेट करें",
    resetPasswordDesc: "नीचे अपना नया पासवर्ड दर्ज करें",
    password: "नया पासवर्ड",
    passwordPlaceholder: "••••••••",
    passwordHint: "कम से कम 8 वर्ण, संख्या और प्रतीक",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "••••••••",
    resetBtn: "पासवर्ड रीसेट करें",
    resetting: "रीसेट कर रहे हैं...",
    backToLogin: "लॉगिन पर वापस जाएं",
    success: "✅ पासवर्ड सफलतापूर्वक रीसेट हो गया! लॉगिन कर रहे हैं...",
    error: "पासवर्ड रीसेट करने में असमर्थ। कृपया पुन: प्रयास करें।",
    invalidToken: "❌ अमान्य या समाप्त रीसेट लिंक। कृपया एक नया अनुरोध करें।",
    passwordMismatch: "पासवर्ड मेल नहीं खाते",
    passwordTooShort: "पासवर्ड कम से कम 8 वर्णों का होना चाहिए",
    showPassword: "दिखाएं",
    hidePassword: "छिपाएं"
  }
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const [tokenValid, setTokenValid] = useState(token ? true : false);
  const t = translations[language];

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage({
        type: "error",
        text: t.invalidToken
      });
    }
  }, [token, t]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    // Validation
    if (password.length < 8) {
      setMessage({
        type: "error",
        text: t.passwordTooShort
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: t.passwordMismatch
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, password })
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

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setMessage({
        type: "error",
        text: t.error
      });
      setIsSubmitting(false);
    }
  }

  if (!tokenValid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 right-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>

        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all font-bold"
          >
            ← {t.backToLogin}
          </Link>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
            <p className="text-red-700 bg-red-50 p-4 rounded-lg font-medium">
              {t.invalidToken}
            </p>
            <Link
              href="/forgot-password"
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 right-20 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>

      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all font-bold"
        >
          ← {t.backToLogin}
        </Link>
      </div>

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
        <div className="text-center mb-8">
          <div className="text-6xl mb-2 inline-block">🔑</div>
          <h1 className="text-3xl font-black text-white">Message Mitra</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{t.resetPasswordTitle}</h2>
            <p className="mt-2 text-slate-600">{t.resetPasswordDesc}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                disabled={isSubmitting}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500">{t.passwordHint}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-900">{t.confirmPassword}</label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showConfirmPassword ? t.hidePassword : t.showPassword}
                </button>
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={t.confirmPasswordPlaceholder}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isSubmitting ? t.resetting : t.resetBtn}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <p className="text-slate-700">Loading password reset...</p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
