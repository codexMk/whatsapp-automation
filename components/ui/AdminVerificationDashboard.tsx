"use client";

import { useCallback, useEffect, useState } from "react";

interface VerificationUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  businessName: string | null;
  ownerName: string | null;
  category: string | null;
  verification: {
    email: boolean;
    phone: boolean;
    business: boolean;
    fullyVerified: boolean;
  };
  createdAt: string;
}

interface VerificationData {
  users: VerificationUser[];
  summary: {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    emailVerified: number;
    phoneVerified: number;
    businessVerified: number;
    fullyVerifiedPercentage: number;
  };
}

export function AdminVerificationDashboard() {
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
  const [searchEmail, setSearchEmail] = useState("");

  const fetchVerificationData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      if (searchEmail) params.append("search", searchEmail);

      const response = await fetch(`/api/admin/users-verification?${params}`);
      if (!response.ok) throw new Error("Failed to fetch verification data");

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load verification data");
    } finally {
      setLoading(false);
    }
  }, [filter, searchEmail]);

  useEffect(() => {
    void fetchVerificationData();
  }, [fetchVerificationData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold">{error || "Failed to load verification data"}</p>
      </div>
    );
  }

  const { users, summary } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">✅ User Verification Status</h2>
        <p className="text-slate-600 mt-1">Track user verification progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-bold text-slate-600 mb-2">✅ Fully Verified</p>
          <p className="text-4xl font-bold text-green-600">{summary.verifiedUsers}</p>
          <p className="text-xs text-slate-600 mt-2">{summary.fullyVerifiedPercentage}% of users</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm font-bold text-slate-600 mb-2">⏳ Pending Verification</p>
          <p className="text-4xl font-bold text-yellow-600">{summary.unverifiedUsers}</p>
          <p className="text-xs text-slate-600 mt-2">Need email, phone, or business verification</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-bold text-slate-600 mb-2">👥 Total Users</p>
          <p className="text-4xl font-bold text-blue-600">{summary.totalUsers}</p>
          <p className="text-xs text-slate-600 mt-2">Active user accounts</p>
        </div>
      </div>

      {/* Verification Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Verification Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-600 mb-1">Email Verified</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(summary.emailVerified / summary.totalUsers) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900">{summary.emailVerified}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-600 mb-1">Phone Verified</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${(summary.phoneVerified / summary.totalUsers) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900">{summary.phoneVerified}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-600 mb-1">Business Verified</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${(summary.businessVerified / summary.totalUsers) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900">{summary.businessVerified}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            {(["all", "verified", "unverified"] as const).map(filterOption => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filterOption === "all"
                  ? "All Users"
                  : filterOption === "verified"
                  ? "Verified"
                  : "Unverified"}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name || user.email}</p>
                        <p className="text-xs text-slate-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{user.businessName || "—"}</p>
                        <p className="text-xs text-slate-600">{user.category || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.verification.email
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.verification.email ? "✅" : "❌"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.verification.phone
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.verification.phone ? "✅" : "❌"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.verification.fullyVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {user.verification.fullyVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-600">
            No users found for this filter
          </div>
        )}
      </div>
    </div>
  );
}
