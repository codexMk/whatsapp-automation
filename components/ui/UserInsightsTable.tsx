"use client";

import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/pricing";

interface UserUsageData {
  id: string;
  email: string;
  name: string;
  businessName: string;
  role: string;
  planName: string;
  messagesUsedThisMonth: number;
  messageLimit: number;
  remainingMessages: number;
  usagePercentage: number;
  extraMessagesUsed: number;
  estimatedExtraCost: number;
}

interface UserInsightsResponse {
  users: UserUsageData[];
  summary: {
    totalUsers: number;
    totalMessagesUsed: number;
    usersExceeded: number;
    usersNearLimit: number;
    totalEstimatedExtraCost: number;
  };
}

export function UserInsightsTable() {
  const [data, setData] = useState<UserInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "highUsage" | "exceeded">("all");

  const fetchUsageData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === "highUsage") params.append("highUsage", "true");
      if (filter === "exceeded") params.append("exceeded", "true");

      const response = await fetch(`/api/admin/user-usage?${params}`);
      if (!response.ok) throw new Error("Failed to fetch user insights");

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user insights");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void fetchUsageData();
  }, [fetchUsageData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold">{error || "Failed to load user insights"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-slate-900">👥 User Usage Insights</h3>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded p-4">
            <p className="text-xs text-slate-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">{data.summary.totalUsers}</p>
          </div>
          <div className="bg-yellow-50 rounded p-4">
            <p className="text-xs text-slate-600">Near Limit</p>
            <p className="text-2xl font-bold text-yellow-600">{data.summary.usersNearLimit}</p>
          </div>
          <div className="bg-red-50 rounded p-4">
            <p className="text-xs text-slate-600">Exceeded</p>
            <p className="text-2xl font-bold text-red-600">{data.summary.usersExceeded}</p>
          </div>
          <div className="bg-green-50 rounded p-4">
            <p className="text-xs text-slate-600">Extra Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(data.summary.totalEstimatedExtraCost)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setFilter("highUsage")}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === "highUsage"
              ? "bg-yellow-600 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          }`}
        >
          High Usage (80%+)
        </button>
        <button
          onClick={() => setFilter("exceeded")}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === "exceeded"
              ? "bg-red-600 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          }`}
        >
          Exceeded Limit
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">User</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-slate-900">Extra Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.users.length > 0 ? (
              data.users.map(user => (
                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{user.name || user.email}</p>
                      <p className="text-xs text-slate-600">{user.email}</p>
                      {user.businessName && (
                        <p className="text-xs text-slate-600">{user.businessName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{user.planName}</p>
                    <p className="text-xs text-slate-600">{user.messageLimit} msgs/month</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        {user.messagesUsedThisMonth}/{user.messageLimit}
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${getUsageBarColor(user.usagePercentage)}`}
                          style={{ width: `${Math.min(user.usagePercentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{user.usagePercentage}%</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(user.usagePercentage)}`}>
                      {getStatusLabel(user.usagePercentage)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.extraMessagesUsed > 0 ? (
                      <div>
                        <p className="font-semibold text-red-600">{formatCurrency(user.estimatedExtraCost)}</p>
                        <p className="text-xs text-slate-600">{user.extraMessagesUsed} extra</p>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-600">
                  No users found for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getUsageBarColor(percentage: number): string {
  if (percentage >= 100) return "bg-red-600";
  if (percentage >= 80) return "bg-yellow-600";
  return "bg-blue-600";
}

function getStatusBadgeClass(percentage: number): string {
  if (percentage >= 100) return "bg-red-100 text-red-800";
  if (percentage >= 80) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

function getStatusLabel(percentage: number): string {
  if (percentage >= 100) return "Exceeded";
  if (percentage >= 80) return "High Usage";
  return "Normal";
}
