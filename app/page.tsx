"use client";

import Link from "next/link";
import { useState } from "react";
import { CategoryCard } from "@/components/ui/category-card";
import { LivePlatformStats } from "@/components/ui/live-platform-stats";

const translations = {
  en: {
    appName: "Message Mitra",
    loginBtn: "Log in",
    getStarted: "Get Started",
    heroTitle: "WhatsApp Automation for Your Local Business",
    heroDesc: "Send targeted campaigns, automate customer interactions, and grow faster than your competition",
    startFree: "🚀 Start Free 30 Days",
    learnMore: "Learn More →",
    msgDaily: "Messages Sent Daily",
    activeBusinesses: "Active Businesses",
    deliveryRate: "Delivery Rate",
    featuresTitle: "Powerful Features Built for You",
    categoriesTitle: "Built for Your Industry",
    categoriesDesc: "Get industry-specific templates and automations from day one",
    trustedTitle: "Trusted by Thousands",
    crazyTitle: "The Crazy Part?",
    crazySubtitle: "You can send campaigns while you sleep! 😴",
    scheduleMsg: "Schedule at 3 AM",
    scheduleDesc: "Send messages at perfect times while you sleep",
    instantMsg: "Instant Delivery",
    instantDesc: "Messages delivered in seconds, not hours",
    autoMsg: "Auto-Follow Ups",
    autoDesc: "Automated responses that sound human",
    readyTitle: "Ready to Transform Your Business?",
    readyDesc: "Join thousands of businesses already growing with Message Mitra. No credit card required.",
    startTrial: "Start Free Trial",
    scheduleDemo: "Schedule Demo",
    footerTagline: "The fastest way to automate WhatsApp for your business",
    footerProduct: "Product",
    footerCompany: "Company",
    footerLegal: "Legal",
    copyright: "© 2026 Message Mitra. All rights reserved. 🚀"
  },
  mr: {
    appName: "मेसेज मित्र",
    loginBtn: "लॉग इन करा",
    getStarted: "सुरुवात करा",
    heroTitle: "आपल्या स्थानिक व्यवसायासाठी व्हाट्सअँप ऑटोमेशन",
    heroDesc: "लक्ष्यित मोहिमा पाठवा, ग्राहक परस्परक्रिया स्वयंचलित करा आणि आपल्या प्रतिस्पर्ध्यापेक्षा वेगाने वाढ करा",
    startFree: "🚀 30 दिन विनामूल्य सुरुवात करा",
    learnMore: "अधिक जाणून घ्या →",
    msgDaily: "दैनिक संदेश पाठवले",
    activeBusinesses: "सक्रिय व्यवसाय",
    deliveryRate: "डिलिव्हरी दर",
    featuresTitle: "आपल्यासाठी बनवलेली शक्तिशाली वैशिष्ट्ये",
    categoriesTitle: "आपल्या उद्योगासाठी बनवले",
    categoriesDesc: "पहिल्या दिवसापासून उद्योग-विशिष्ट टेम्पलेट आणि स्वयंचलितताएं मिळवा",
    trustedTitle: "हजारांनी विश्वास ठेवले",
    crazyTitle: "पागल भाग काय आहे?",
    crazySubtitle: "आप झोपत असताना मोहिमा पाठवू शकता! 😴",
    scheduleMsg: "रात्री 3 वाजता शेड्यूल करा",
    scheduleDesc: "आप झोपत असताना परिपूर्ण वेळी संदेश पाठवा",
    instantMsg: "तात्काळ डिलिव्हरी",
    instantDesc: "संदेश सेकंदांमध्ये डिलिव्हर केले जातात, तासांमध्ये नाही",
    autoMsg: "स्वयंचलित फॉलो अप्स",
    autoDesc: "स्वयंचलित प्रतिक्रिया जी मानवी वाटते",
    readyTitle: "आपल्या व्यवसाय परिवर्तित करण्यासाठी तयार?",
    readyDesc: "मेसेज मित्रासाठी आधीच वाढ करत असलेल्या हजारो व्यवसायांमध्ये सामील व्हा। क्रेडिट कार्डची आवश्यकता नाही।",
    startTrial: "विनामूल्य चाचणी सुरुवात करा",
    scheduleDemo: "डेमो शेड्यूल करा",
    footerTagline: "आपल्या व्यवसायासाठी व्हाट्सअँप स्वयंचलित करण्याचा सर्वात जलद मार्ग",
    footerProduct: "उत्पाद",
    footerCompany: "कंपनी",
    footerLegal: "कायदेशीर",
    copyright: "© 2026 मेसेज मित्र. सर्व अधिकार राखीव. 🚀"
  },
  hi: {
    appName: "मैसेज मित्र",
    loginBtn: "लॉग इन",
    getStarted: "शुरुआत करें",
    heroTitle: "अपने स्थानीय व्यवसाय के लिए व्हाट्सएप स्वचालन",
    heroDesc: "लक्षित अभियान भेजें, ग्राहक इंटरैक्शन को स्वचालित करें, और अपनी प्रतिद्वंद्विता से तेजी से बढ़ें",
    startFree: "🚀 30 दिन निःशुल्क शुरुआत करें",
    learnMore: "और जानें →",
    msgDaily: "दैनिक संदेश भेजे गए",
    activeBusinesses: "सक्रिय व्यवसाय",
    deliveryRate: "डिलीवरी दर",
    featuresTitle: "आपके लिए बनाई गई शक्तिशाली सुविधाएं",
    categoriesTitle: "अपने उद्योग के लिए बनाया गया",
    categoriesDesc: "पहले दिन से ही उद्योग-विशिष्ट टेम्पलेट और स्वचालन प्राप्त करें",
    trustedTitle: "हजारों द्वारा विश्वसनीय",
    crazyTitle: "पागल हिस्सा क्या है?",
    crazySubtitle: "आप सो रहे हों तो भी अभियान भेज सकते हैं! 😴",
    scheduleMsg: "सुबह 3 बजे शेड्यूल करें",
    scheduleDesc: "आप सो रहे हों तो परफेक्ट समय पर संदेश भेजें",
    instantMsg: "तुरंत डिलिवरी",
    instantDesc: "संदेश मिनटों में नहीं, सेकंड में डिलीवर होते हैं",
    autoMsg: "स्वचालित फॉलो अप्स",
    autoDesc: "स्वचालित प्रतिक्रिया जो मानवीय लगती है",
    readyTitle: "अपने व्यवसाय को बदलने के लिए तैयार?",
    readyDesc: "उन हजारों व्यवसायों में शामिल हों जो पहले से ही मैसेज मित्र के साथ बढ़ रहे हैं। क्रेडिट कार्ड की आवश्यकता नहीं।",
    startTrial: "निःशुल्क परीक्षण शुरू करें",
    scheduleDemo: "डेमो शेड्यूल करें",
    footerTagline: "अपने व्यवसाय के लिए व्हाट्सएप को स्वचालित करने का सबसे तेज़ तरीका",
    footerProduct: "उत्पाद",
    footerCompany: "कंपनी",
    footerLegal: "कानूनी",
    copyright: "© 2026 मैसेज मित्र. सर्वाधिकार सुरक्षित. 🚀"
  }
};

const CATEGORIES = [
  {
    id: "clinic",
    title: "Clinic",
    description: "Appointment reminders, health tips, and patient engagement",
    icon: "🏥"
  },
  {
    id: "shop",
    title: "Shop",
    description: "Product updates, sales, and customer notifications",
    icon: "🛍️"
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Property listings, viewing updates, and client inquiries",
    icon: "🏠"
  },
  {
    id: "coaching",
    title: "Coaching",
    description: "Session reminders, progress updates, and announcements",
    icon: "💪"
  },
  {
    id: "csc",
    title: "CSC",
    description: "Service notifications and citizen engagement",
    icon: "🏛️"
  }
];

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "mr" | "hi">("en");
  const t = translations[language];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Header - Blue Bar */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            ⚡ {t.appName}
          </div>
          <div className="flex gap-4 items-center">
            {/* Language Toggle */}
            <div className="flex gap-2 bg-white/20 rounded-lg p-1">
              {["en", "mr", "hi"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as "en" | "mr" | "hi")}
                  className={`px-3 py-1 rounded-md font-bold text-sm transition-all ${
                    language === lang
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              href="/login"
              className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all-smooth font-medium"
            >
              {t.loginBtn}
            </Link>
            <Link
              href="/category-select"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg transition-all-smooth font-bold"
            >
              {t.getStarted}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 via-white to-white px-6 py-20 sm:py-32">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative mx-auto max-w-6xl text-center animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6">
            {t.heroTitle}
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-slide-up">
            <Link
              href="/category-select"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all-smooth inline-block"
            >
              {t.startFree}
            </Link>
            <Link
              href="/#features"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all-smooth inline-block"
            >
              {t.learnMore}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section - Live Dynamic Stats */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-16 sm:py-24 text-white">
        <LivePlatformStats />
      </div>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-20 sm:py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-5xl sm:text-6xl font-black text-center text-white mb-16">
            {t.featuresTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 animate-stagger">
            {[
              {
                icon: "📊",
                title: "Real-time Analytics",
                desc: "Track campaign performance with beautiful dashboards"
              },
              {
                icon: "🤖",
                title: "Smart Automation",
                desc: "Trigger messages based on customer behavior automatically"
              },
              {
                icon: "📱",
                title: "Mobile First",
                desc: "Manage campaigns on the go with mobile-optimized interface"
              },
              {
                icon: "🎯",
                title: "Precise Targeting",
                desc: "Segment customers and send personalized messages"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Messages delivered in seconds, not minutes"
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                desc: "Bank-level encryption and compliance with all regulations"
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all-smooth hover:scale-105 animate-scale-in border border-blue-300 text-white"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-blue-100 text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl sm:text-6xl font-black text-center text-slate-900 mb-4">
            {t.categoriesTitle}
          </h2>
          <p className="text-center text-xl text-slate-600 max-w-2xl mx-auto mb-16">
            {t.categoriesDesc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-stagger">
            {CATEGORIES.map((category) => (
              <div key={category.id} className="animate-slide-up">
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-20 sm:py-32 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-5xl sm:text-6xl font-black text-center mb-16">
            {t.trustedTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 animate-stagger">
            {[
              { name: "Raj Kumar", role: "Clinic Owner", feedback: "Increased patient engagement by 300% in just 2 months!" },
              { name: "Priya Singh", role: "Shop Owner", feedback: "My sales went up 40% after implementing WhatsApp campaigns" },
              { name: "Amit Patel", role: "Real Estate Agent", feedback: "Best ROI I've ever seen from a marketing tool" }
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20 animate-scale-in hover:bg-white/20 transition-all-smooth">
                <p className="text-lg mb-4 italic">"{testimonial.feedback}"</p>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-blue-100 text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crazy Feature Section - Send at 3 AM 🤪 */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-20 sm:py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 text-8xl animate-bounce">💬</div>
          <div className="absolute bottom-20 left-10 text-8xl animate-bounce" style={{ animationDelay: '0.2s' }}>📱</div>
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="text-6xl mb-6 animate-pulse">🤪</div>
          <h2 className="text-5xl sm:text-6xl font-black mb-6">{t.crazyTitle}</h2>
          <p className="text-2xl font-bold mb-8">{t.crazySubtitle}</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-6 border border-white/30">
              <div className="text-4xl mb-3">🌙</div>
              <h3 className="font-bold text-xl mb-2">{t.scheduleMsg}</h3>
              <p className="text-white/90">{t.scheduleDesc}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-6 border border-white/30">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-xl mb-2">{t.instantMsg}</h3>
              <p className="text-white/90">{t.instantDesc}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-6 border border-white/30">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-xl mb-2">{t.autoMsg}</h3>
              <p className="text-white/90">{t.autoDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl text-center animate-slide-up">
          <h2 className="text-5xl sm:text-6xl font-black text-slate-900 mb-8">
            {t.readyTitle}
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            {t.readyDesc}
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              href="/category-select"
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-black text-xl hover:shadow-2xl hover:scale-105 transition-all-smooth"
            >
              {t.startTrial}
            </Link>
            <Link
              href="#"
              className="px-10 py-5 border-2 border-blue-600 text-blue-600 rounded-xl font-black text-xl hover:bg-blue-50 transition-all-smooth"
            >
              {t.scheduleDemo}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">⚡ {t.appName}</h3>
              <p className="text-slate-400">{t.footerTagline}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footerProduct}</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footerCompany}</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footerLegal}</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/refund" className="hover:text-white transition">Refund</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
