"use client";

import { useEffect, useState, useCallback } from "react";

interface DashboardStats {
  stats: {
    totalCustomers: number;
    totalCampaigns: number;
    messagesSent: number;
    activeAutomations: number;
  };
  campaignProgress: Record<string, { sent: number; total: number }>;
  recentActivities: Array<{
    id: string;
    toPhone: string;
    status: string;
    content: string;
    timestamp: string;
    campaignName: string;
    customerName: string;
  }>;
  timestamp: string;
}

interface RealtimeDashboardProps {
  pollInterval?: number; // in milliseconds, default 5000
  onStatsUpdate?: (stats: DashboardStats) => void;
}

export function useRealtimeDashboardStats(
  pollInterval: number = 5000,
  onStatsUpdate?: (stats: DashboardStats) => void
) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data.data);
      setLastUpdate(new Date());
      setError(null);

      // Call the optional callback when stats are updated
      if (onStatsUpdate) {
        onStatsUpdate(data.data);
      }
    } catch (err) {
      console.error("[REALTIME_STATS] Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, [onStatsUpdate]);

  useEffect(() => {
    // Fetch immediately on mount
    fetchStats();

    // Set up polling interval
    const pollInterval_id = setInterval(fetchStats, pollInterval);

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval_id);
    };
  }, [fetchStats, pollInterval]);

  return {
    stats,
    loading,
    error,
    lastUpdate,
    refetch: fetchStats
  };
}

export function RealtimeStatsCard({
  label,
  value,
  icon,
  unit = "",
  isLoading = false
}: {
  label: string;
  value: number;
  icon: string;
  unit?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {isLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              `${value.toLocaleString()}${unit}`
            )}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export function ActivityFeed({
  activities,
  isLoading = false,
  maxItems = 10
}: {
  activities: DashboardStats["recentActivities"];
  isLoading?: boolean;
  maxItems?: number;
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DELIVERED: "bg-green-100 text-green-800",
      SENT: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      FAILED: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      DELIVERED: "✅",
      SENT: "📤",
      PENDING: "⏳",
      FAILED: "❌"
    };
    return emojis[status] || "📨";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : activities && activities.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.slice(0, maxItems).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
            >
              <div className="text-2xl">{getStatusEmoji(activity.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {activity.customerName}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Campaign: {activity.campaignName}
                </p>
                <p className="text-xs text-slate-600 mt-1 truncate">
                  {activity.content}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">No recent activity</p>
      )}
    </div>
  );
}

export function CampaignProgress({
  campaigns,
  isLoading = false
}: {
  campaigns: Record<string, { sent: number; total: number }>;
  isLoading?: boolean;
}) {
  const entries = Object.entries(campaigns).slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Campaign Progress</h3>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map(([campaignId, data]) => {
            const percentage =
              data.total > 0 ? Math.round((data.sent / data.total) * 100) : 0;
            return (
              <div key={campaignId}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    Campaign {campaignId.substring(0, 8)}...
                  </p>
                  <span className="text-xs text-slate-500">
                    {data.sent} / {data.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{percentage}% sent</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8">No campaigns</p>
      )}
    </div>
  );
}
