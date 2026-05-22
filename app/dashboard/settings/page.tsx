"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/InputField";
import { Input } from "@/components/ui/input";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Bangkok",
  "Asia/Singapore",
  "UTC",
  "Europe/London",
  "America/New_York"
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [profileForm, setProfileForm] = useState({
    businessName: "",
    category: "",
    whatsappNumber: "",
    timezone: "Asia/Kolkata"
  });

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  type PasswordVisibilityField = "current" | "new" | "confirm";
  type PasswordVisibilityKey =
    | "showCurrentPassword"
    | "showNewPassword"
    | "showConfirmPassword";

  // Load user settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProfileForm({
              businessName: data.data.businessName || "",
              category: data.data.category || "",
              whatsappNumber: data.data.whatsappNumber || "",
              timezone: data.data.timezone || "Asia/Kolkata"
            });
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMessage(null);

    if (!profileForm.businessName.trim()) {
      setProfileMessage({ type: "error", text: "Business name is required" });
      return;
    }

    setSavingProfile(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileMessage({
          type: "error",
          text: data.error || "Failed to save profile"
        });
        setSavingProfile(false);
        return;
      }

      setProfileMessage({
        type: "success",
        text: "Profile saved successfully!"
      });

      setSavingProfile(false);
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: "An error occurred. Please try again."
      });
      setSavingProfile(false);
    }
  }

  const togglePasswordVisibility = (field: PasswordVisibilityField) => {
    const fieldMap: Record<PasswordVisibilityField, PasswordVisibilityKey> = {
      current: "showCurrentPassword",
      new: "showNewPassword",
      confirm: "showConfirmPassword"
    };

    const key = fieldMap[field];

    setChangePasswordForm(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMessage(null);

    // Validation
    if (changePasswordForm.newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 8 characters"
      });
      return;
    }

    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Passwords do not match"
      });
      return;
    }

    if (changePasswordForm.currentPassword === changePasswordForm.newPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must be different from current password"
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: changePasswordForm.currentPassword,
          newPassword: changePasswordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({
          type: "error",
          text: data.error || "Failed to change password"
        });
        setIsChangingPassword(false);
        return;
      }

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully!"
      });

      // Reset form
      setChangePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });

      setIsChangingPassword(false);
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: "An error occurred. Please try again."
      });
      setIsChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Settings"
          description="Configure your business profile and WhatsApp connection."
        />
        <div className="text-center py-12">
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure your business profile and WhatsApp connection."
      />

      {/* Business Profile */}
      <AppCard>
        <h2 className="text-2xl font-black text-white mb-8">Business Profile</h2>

        {profileMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            profileMessage.type === "success"
              ? "bg-green-50 border-2 border-green-500"
              : "bg-red-50 border-2 border-red-500"
          }`}>
            <p className={profileMessage.type === "success" ? "text-green-700" : "text-red-700"}>
              {profileMessage.type === "success" ? "✅" : "❌"} {profileMessage.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="grid gap-6 md:grid-cols-2">
          <InputField
            label="Business Name"
            name="businessName"
            placeholder="e.g. GreenLeaf Coaching"
            value={profileForm.businessName}
            onChange={handleProfileInputChange}
            disabled={savingProfile}
            helperText="Your business name visible to customers"
          />

          <InputField
            label="Category"
            name="category"
            placeholder="e.g. Clinic, Coaching, Real Estate"
            value={profileForm.category}
            onChange={handleProfileInputChange}
            disabled={savingProfile}
            helperText="Your business industry type"
          />

          <InputField
            label="WhatsApp Number"
            name="whatsappNumber"
            placeholder="+91 98765 43210"
            value={profileForm.whatsappNumber}
            onChange={handleProfileInputChange}
            disabled={savingProfile}
            helperText="Your WhatsApp Business account number"
          />

          <div>
            <label htmlFor="timezone" className="block text-sm font-bold text-gray-900 mb-2">
              Timezone
            </label>
            <select
              name="timezone"
              value={profileForm.timezone}
              onChange={handleProfileInputChange}
              disabled={savingProfile}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Used for scheduling and reporting</p>
          </div>

          <div className="md:col-span-2 pt-4">
            <Button
              type="submit"
              disabled={savingProfile}
              className={`px-8 py-3 font-bold ${
                savingProfile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {savingProfile ? "Saving..." : "💾 Save Profile"}
            </Button>
          </div>
        </form>
      </AppCard>

      {/* WhatsApp Connection */}
      <AppCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <div className="flex items-start gap-6">
          <div className="text-5xl">🔗</div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">WhatsApp Connection</h2>
            <p className="mt-4 text-slate-700 text-sm leading-relaxed max-w-2xl">
              Connect your WhatsApp Business account to start sending messages. You'll need your API credentials from your WhatsApp Business provider.
            </p>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 font-bold">
              📱 Connect WhatsApp Account
            </Button>
          </div>
        </div>
      </AppCard>

      {/* Change Password */}
      <AppCard>
        <h2 className="text-2xl font-black text-white mb-8">🔐 Change Password</h2>
        <form onSubmit={handleChangePassword} className="grid gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900 dark:text-white">
                Current Password
              </label>
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {changePasswordForm.showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              type={changePasswordForm.showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="••••••••"
              required
              value={changePasswordForm.currentPassword}
              onChange={handlePasswordInputChange}
              disabled={isChangingPassword}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900 dark:text-white">
                New Password
              </label>
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {changePasswordForm.showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              type={changePasswordForm.showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="••••••••"
              required
              value={changePasswordForm.newPassword}
              onChange={handlePasswordInputChange}
              disabled={isChangingPassword}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-500">Min 8 characters, numbers and symbols recommended</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900 dark:text-white">
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {changePasswordForm.showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              type={changePasswordForm.showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              required
              value={changePasswordForm.confirmPassword}
              onChange={handlePasswordInputChange}
              disabled={isChangingPassword}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {passwordMessage && (
            <div
              className={`rounded-lg p-4 text-sm font-medium ${
                passwordMessage.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {passwordMessage.text}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 font-bold"
            >
              {isChangingPassword ? "Changing..." : "🔑 Change Password"}
            </Button>
          </div>
        </form>
      </AppCard>

      {/* Account Information */}
      <AppCard>
        <h2 className="text-2xl font-black text-white mb-8">Account Information</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Account Status</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                Active
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Current Plan</p>
            <p className="mt-3 text-2xl font-black text-white">Free</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Member Since</p>
            <p className="mt-3 text-lg font-bold text-white">Feb. 2026</p>
          </div>
        </div>
      </AppCard>

      {/* Danger Zone */}
      <AppCard className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50">
        <div className="flex items-start gap-6">
          <div className="text-5xl">⚠️</div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-red-900">Danger Zone</h2>
            <p className="mt-3 text-sm text-red-900 leading-relaxed">
              These actions cannot be undone. Please proceed with extreme caution as deleting your account will remove all data.
            </p>
            <Button className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 font-bold">
              🗑️ Delete Account
            </Button>
          </div>
        </div>
      </AppCard>
    </PageContainer>
  );
}
