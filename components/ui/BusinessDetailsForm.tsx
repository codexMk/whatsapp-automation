"use client";

import { useState } from "react";
import { validateIndianPhone } from "@/lib/otp-utils";

interface BusinessDetailsFormProps {
  onSubmit: (data: {
    businessName: string;
    ownerName: string;
    category: string;
    address: string;
    phone: string;
    whatsappNumber: string;
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
}

const CATEGORIES = [
  "Retail",
  "E-commerce",
  "Healthcare",
  "Education",
  "Restaurant",
  "Real Estate",
  "Logistics",
  "Finance",
  "Travel",
  "IT Services",
  "Consulting",
  "Beauty & Salon",
  "Automotive",
  "Other"
];

export function BusinessDetailsForm({
  onSubmit,
  loading = false,
  error
}: BusinessDetailsFormProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    category: "",
    address: "",
    phone: "",
    whatsappNumber: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validateIndianPhone(formData.phone)) {
      newErrors.phone = "Only Indian phone numbers (+91) are supported";
    }
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!validateIndianPhone(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Only Indian phone numbers (+91) are supported";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          📋 Business Details
        </h2>
        <p className="text-slate-600">
          Please provide your business information to complete verification
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your business name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.businessName ? "border-red-400" : "border-slate-300"
            }`}
            disabled={loading}
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Owner Name *
          </label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Your full name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.ownerName ? "border-red-400" : "border-slate-300"
            }`}
            disabled={loading}
          />
          {errors.ownerName && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Business Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.category ? "border-red-400" : "border-slate-300"
            }`}
            disabled={loading}
          >
            <option value="">Select category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9999999999"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.phone ? "border-red-400" : "border-slate-300"
            }`}
            disabled={loading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">
          Address *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Full business address"
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            errors.address ? "border-red-400" : "border-slate-300"
          }`}
          disabled={loading}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* WhatsApp Number */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">
          WhatsApp Number *
        </label>
        <input
          type="tel"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          placeholder="+91 9999999999"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            errors.whatsappNumber ? "border-red-400" : "border-slate-300"
          }`}
          disabled={loading}
        />
        {errors.whatsappNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400"
      >
        {loading ? "Verifying..." : "Complete Verification"}
      </button>
    </form>
  );
}
