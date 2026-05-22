"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/pricing";

interface MetricsData {
  platformMetrics: {
    totalActiveUsers: number;
    totalMessagesUsed: number;
    totalRevenue: number;
    totalExtraCost: number;
    plannedMRR: number;
    avgMessagesPerUser: number;
    usersExceededLimit: number;
    usersNearLimit: number;
  };
  usersByPlan: Record<string, number>;
  planDetails: Array<{
    name: string;
    price: number;
    messageLimit: number;
    userCount: number;
  }>;
}

export function AdminMetricsDashboard() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/admin/metrics");
      if (!response.ok) throw new Error("Failed to fetch metrics");
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-semibold">{error || "Failed to load metrics"}</p>
      </div>
    );
  }

  const metrics = data.platformMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">📈 Platform Metrics</h2>
        <p className="text-slate-600 mt-1">Real-time overview of your SaaS platform</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={metrics.totalActiveUsers}
          icon="👥"
          trend="up"
        />
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon="💰"
          trend="up"
        />
        <MetricCard
          title="Messages Sent"
          value={metrics.totalMessagesUsed.toLocaleString()}
          icon="💬"
          trend="up"
        />
        <MetricCard
          title="Extra Revenue"
          value={formatCurrency(metrics.totalExtraCost)}
          icon="📊"
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Planned MRR"
          value={formatCurrency(metrics.plannedMRR)}
          icon="📅"
          subtitle="From active subscriptions"
        />
        <MetricCard
          title="Avg Messages/User"
          value={metrics.avgMessagesPerUser}
          icon="📈"
          subtitle="Monthly average"
        />
        <MetricCard
          title="Users Exceeding Limits"
          value={metrics.usersExceededLimit}
          icon="⚠️"
          subtitle={`+${metrics.usersNearLimit} nearing limit`}
          highlight={metrics.usersExceededLimit > 0 ? "warning" : "normal"}
        />
      </div>

      {/* Plan Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 Plans Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.planDetails.map(plan => (
            <div key={plan.name} className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition">
              <h4 className="font-bold text-slate-900 mb-4">{plan.name}</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Users</p>
                  <p className="text-3xl font-bold text-blue-600">{plan.userCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Monthly Price</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(plan.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Message Limit</p>
                  <p className="text-lg font-bold text-slate-900">{plan.messageLimit}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-slate-600">Plan MRR</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(plan.userCount * plan.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Status Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">⚡ User Status Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-sm font-bold text-slate-600 mb-2">✅ Normal Usage</p>
            <p className="text-4xl font-bold text-green-600">
              {metrics.totalActiveUsers - metrics.usersNearLimit - metrics.usersExceededLimit}
            </p>
            <p className="text-xs text-slate-600 mt-2">Users within limits</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-sm font-bold text-slate-600 mb-2">⚠️ Near Limit</p>
            <p className="text-4xl font-bold text-yellow-600">{metrics.usersNearLimit}</p>
            <p className="text-xs text-slate-600 mt-2">80% to 100% usage</p>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <p className="text-sm font-bold text-slate-600 mb-2">🚨 Exceeded</p>
            <p className="text-4xl font-bold text-red-600">{metrics.usersExceededLimit}</p>
            <p className="text-xs text-slate-600 mt-2">Over 100% usage</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: string;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  highlight?: "normal" | "warning" | "success";
}

function MetricCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  highlight = "normal"
}: MetricCardProps) {
  const bgClass = {
    normal: "bg-blue-50",
    warning: "bg-yellow-50",
    success: "bg-green-50"
  }[highlight];

  const borderClass = {
    normal: "border-blue-200",
    warning: "border-yellow-200",
    success: "border-green-200"
  }[highlight];

  return (
    <div className={`${bgClass} border ${borderClass} rounded-lg p-6`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-bold text-slate-600">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-600 mt-2">{subtitle}</p>}
      {trend && (
        <p className={`text-xs font-bold mt-2 ${
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-600"
        }`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {
            trend === "up" ? "Growing" : trend === "down" ? "Declining" : "Stable"
          }
        </p>
      )}
    </div>
  );
}
