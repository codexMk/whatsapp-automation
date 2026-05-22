"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/InputField";
import { PageContainer } from "@/components/layout/PageContainer";

const CATEGORIES = {
  clinic: "🏥 Clinic",
  shop: "🛍️ Shop",
  "real-estate": "🏠 Real Estate",
  coaching: "💪 Coaching",
  csc: "🏛️ CSC",
  other: "📱 Other"
};

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Bangkok",
  "Asia/Singapore",
  "UTC",
  "Europe/London",
  "America/New_York"
];

export default function OnboardingBusinessVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    category: "",
    address: "",
    phone: "",
    whatsappNumber: "",
    timezone: "Asia/Kolkata"
  });

  // Load user session to get initial data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch("/api/user/me");
        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        if (data.success) {
          const user = data.user;

          // Check if already verified
          if (user.isBusinessVerified) {
            router.push("/dashboard");
            return;
          }

          // Pre-fill with existing data
          setFormData(prev => ({
            ...prev,
            businessName: user.businessName || "",
            ownerName: user.ownerName || "",
            category: user.category || "",
            address: user.address || "",
            phone: user.phone || "",
            whatsappNumber: user.whatsappNumber || ""
          }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user data:", err);
        router.push("/login");
      }
    };

    loadUserData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) return "Business name is required";
    if (!formData.ownerName.trim()) return "Owner name is required";
    if (!formData.category) return "Category is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.whatsappNumber.trim()) return "WhatsApp number is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/save-business-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          category: formData.category,
          address: formData.address,
          phone: formData.phone,
          whatsappNumber: formData.whatsappNumber,
          timezone: formData.timezone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save business details");
      }

      setSuccess(true);

      // Save timezone to BusinessSettings
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timezone: formData.timezone
        })
      });

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save business details");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Complete Your Business Profile 🚀</h1>
          <p className="text-lg text-gray-600">
            Just a few details to get your WhatsApp automation up and running
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
            <p className="text-green-700 font-semibold">✅ Business verified! Redirecting to dashboard...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
            <p className="text-red-700 font-semibold">❌ {error}</p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">

          {/* Business Name */}
          <InputField
            label="Business Name *"
            name="businessName"
            placeholder="e.g. Sunrise Dental Clinic"
            value={formData.businessName}
            onChange={handleChange}
            helperText="Your business name visible to customers"
          />

          {/* Owner Name */}
          <InputField
            label="Owner Name *"
            name="ownerName"
            placeholder="e.g. John Doe"
            value={formData.ownerName}
            onChange={handleChange}
            helperText="Name of the business owner"
          />

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Business Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategorySelect(key)}
                  className={`p-3 rounded-lg font-semibold text-center transition-all ${
                    formData.category === key
                      ? "bg-blue-600 text-white border-2 border-blue-700"
                      : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <InputField
            label="Business Address *"
            name="address"
            placeholder="e.g. 123 Main Street, Mumbai"
            value={formData.address}
            onChange={handleChange}
            helperText="Your business location"
          />

          {/* Phone */}
          <InputField
            label="Phone Number *"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            helperText="For customer inquiries"
          />

          {/* WhatsApp Number */}
          <InputField
            label="WhatsApp Number *"
            name="whatsappNumber"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.whatsappNumber}
            onChange={handleChange}
            helperText="Your WhatsApp Business number"
          />

          {/* Timezone */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-bold text-gray-900 mb-2">
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Used for scheduling and reporting</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || success}
            className={`w-full py-3 font-bold text-lg rounded-lg transition-all ${
              submitting || success
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {submitting ? "Saving..." : success ? "✅ Verified! Redirecting..." : "✨ Complete Verification"}
          </Button>
        </form>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
          <p className="text-sm text-gray-700">
            <span className="font-bold">📝 Note:</span> This information helps us verify your business and ensure you get the best customer experience. All details can be updated later in settings.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
