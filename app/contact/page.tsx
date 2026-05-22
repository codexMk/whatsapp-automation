"use client";

import { TopBar } from "@/components/layout/TopBar";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, this would send to an email service
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Contact Us</h1>
          <p className="text-slate-600 mb-8">We'd love to hear from you. Get in touch with our team.</p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-400"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">📧 Email</h3>
                  <p className="text-slate-600 mb-1">General Inquiries:</p>
                  <a href="mailto:info@messagemitra.com" className="text-blue-600 hover:underline font-bold">
                    info@messagemitra.com
                  </a>
                  <p className="text-slate-600 mb-1 mt-2">Support:</p>
                  <a href="mailto:support@messagemitra.com" className="text-blue-600 hover:underline font-bold">
                    support@messagemitra.com
                  </a>
                  <p className="text-slate-600 mb-1 mt-2">Billing:</p>
                  <a href="mailto:billing@messagemitra.com" className="text-blue-600 hover:underline font-bold">
                    billing@messagemitra.com
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">📞 Phone</h3>
                  <p className="text-slate-600">+91-XXXX-XXXX-XXXX</p>
                  <p className="text-sm text-slate-500 mt-1">Mon - Fri, 9 AM - 6 PM IST</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">📍 Address</h3>
                  <p className="text-slate-600">
                    [Your Business Address]<br/>
                    [City, State, Postal Code]<br/>
                    [Country]
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">💬 Live Chat</h3>
                  <p className="text-slate-600">
                    Have a quick question? Use the chat widget at the bottom right of our app to speak with our support team instantly.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">📚 Help Center</h3>
                  <p className="text-slate-600 mb-2">
                    Browse our documentation and FAQs for quick answers.
                  </p>
                  <a href="#" className="text-blue-600 hover:underline font-bold">
                    Visit Help Center →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">24/7</p>
                <p className="text-slate-600">Support Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">&lt;2h</p>
                <p className="text-slate-600">Avg Response Time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">99.9%</p>
                <p className="text-slate-600">Uptime Guarantee</p>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-slate-200">
              <Link href="/" className="text-blue-600 hover:underline font-bold">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
