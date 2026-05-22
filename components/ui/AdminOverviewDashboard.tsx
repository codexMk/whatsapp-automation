"use client";

import { useEffect, useState } from "react";

interface AdminStats {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  superAdmins: number;
  regularAdmins: number;
  neverLoggedIn: number;
  recentlyActive: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface AdminOverviewData {
  summary: AdminStats;
  admins: AdminUser[];
}

export function AdminOverviewDashboard() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/overview");

      if (!response.ok) {
        throw new Error("Failed to fetch admin overview");
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold">{error || "Failed to load admin overview"}</p>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">👥 Admin Overview</h2>
        <p className="text-slate-600 mt-1">Manage and monitor admin accounts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Admins */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-bold text-blue-900 mb-1">Total Admins</p>
          <p className="text-4xl font-bold text-blue-600">{summary.totalAdmins}</p>
          <p className="text-xs text-blue-700 mt-2">All admin accounts</p>
        </div>

        {/* Active Admins */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-bold text-green-900 mb-1">Active Admins</p>
          <p className="text-4xl font-bold text-green-600">{summary.activeAdmins}</p>
          <p className="text-xs text-green-700 mt-2">Can access system</p>
        </div>

        {/* Inactive Admins */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
          <p className="text-sm font-bold text-red-900 mb-1">Inactive Admins</p>
          <p className="text-4xl font-bold text-red-600">{summary.inactiveAdmins}</p>
          <p className="text-xs text-red-700 mt-2">Cannot access system</p>
        </div>

        {/* Super Admins */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <p className="text-sm font-bold text-purple-900 mb-1">Super Admins</p>
          <p className="text-4xl font-bold text-purple-600">{summary.superAdmins}</p>
          <p className="text-xs text-purple-700 mt-2">Full control</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Regular Admins */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm font-bold text-slate-900 mb-1">Regular Admins</p>
          <p className="text-3xl font-bold text-slate-600">{summary.regularAdmins}</p>
          <p className="text-xs text-slate-600 mt-2">Limited permissions</p>
        </div>

        {/* Never Logged In */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm font-bold text-slate-900 mb-1">Never Logged In</p>
          <p className="text-3xl font-bold text-amber-600">{summary.neverLoggedIn}</p>
          <p className="text-xs text-slate-600 mt-2">New accounts</p>
        </div>

        {/* Recently Active (7 days) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm font-bold text-slate-900 mb-1">Recently Active</p>
          <p className="text-3xl font-bold text-blue-600">{summary.recentlyActive}</p>
          <p className="text-xs text-slate-600 mt-2">Last 7 days</p>
        </div>
      </div>

      {/* Admin Status Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Status Breakdown</h3>
        <div className="space-y-4">
          {/* Active Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">Active</span>
              <span className="text-sm font-bold text-green-600">
                {summary.activeAdmins} / {summary.totalAdmins}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{
                  width: `${
                    summary.totalAdmins > 0
                      ? (summary.activeAdmins / summary.totalAdmins) * 100
                      : 0
                  }%`
                }}
              />
            </div>
          </div>

          {/* Inactive Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">Inactive</span>
              <span className="text-sm font-bold text-red-600">
                {summary.inactiveAdmins} / {summary.totalAdmins}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="h-full bg-red-600 rounded-full"
                style={{
                  width: `${
                    summary.totalAdmins > 0
                      ? (summary.inactiveAdmins / summary.totalAdmins) * 100
                      : 0
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Role Distribution</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm font-bold text-purple-900 mb-1">Super Admins</p>
            <p className="text-2xl font-bold text-purple-600">{summary.superAdmins}</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-bold text-blue-900 mb-1">Regular Admins</p>
            <p className="text-2xl font-bold text-blue-600">{summary.regularAdmins}</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-bold">ℹ️ Info:</span> Inactive admins cannot log in or access the admin panel. Use the admin management page to activate/deactivate accounts.
        </p>
      </div>
    </div>
  );
}
