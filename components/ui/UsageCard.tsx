"use client";

import { useEffect, useState } from "react";
import { formatCurrency, getUsageColor, getUsageWarning } from "@/lib/pricing";

interface UsageData {
  planName: string;
  messagesUsedThisMonth: number;
  messageLimit: number;
  remainingMessages: number;
  usagePercentage: number;
  extraMessagesUsed: number;
  estimatedExtraCost: number;
}

export function UsageCard() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch("/api/user/usage");
        if (!response.ok) throw new Error("Failed to fetch usage data");
        const data = await response.json();
        setUsage(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load usage");
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold">{error || "Failed to load usage data"}</p>
      </div>
    );
  }

  const warning = getUsageWarning(usage.usagePercentage);
  const usageColor = getUsageColor(usage.usagePercentage);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">📊 Message Usage</h3>
        <p className="text-slate-600">Your current plan: <span className="font-bold text-blue-600">{usage.planName}</span></p>
      </div>

      {/* Warning */}
      {warning.level !== "none" && (
        <div className={`p-4 border rounded-lg ${getWarningClass(warning.level)}`}>
          <p className="font-semibold">{warning.message}</p>
        </div>
      )}

      {/* Main Usage Stats */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-900">
              {usage.messagesUsedThisMonth} / {usage.messageLimit} messages
            </span>
            <span className="text-sm font-bold text-slate-600">
              {usage.usagePercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usageColor}`}
              style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-slate-600 mb-1">Remaining</p>
            <p className="text-2xl font-bold text-blue-600">{usage.remainingMessages}</p>
            <p className="text-xs text-slate-500 mt-1">messages available</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-600 mb-1">Extra Usage</p>
            <p className="text-2xl font-bold text-slate-900">{usage.extraMessagesUsed}</p>
            <p className="text-xs text-slate-500 mt-1">beyond your limit</p>
          </div>
        </div>

        {/* Extra Cost */}
        {usage.extraMessagesUsed > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-slate-600 mb-1">Estimated Extra Cost</p>
            <p className="text-xl font-bold text-yellow-700">
              {formatCurrency(usage.estimatedExtraCost)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {usage.extraMessagesUsed} extra messages × per-message rate
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      {usage.usagePercentage >= 80 && (
        <button className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
          Upgrade Plan →
        </button>
      )}
    </div>
  );
}

function getWarningClass(level: "warning" | "critical"): string {
  if (level === "critical") {
    return "bg-red-100 border-red-400 text-red-800";
  }
  return "bg-yellow-100 border-yellow-400 text-yellow-800";
}
