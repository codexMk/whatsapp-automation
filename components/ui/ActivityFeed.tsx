"use client";

import { useEffect, useState } from "react";
import { useRealtimeDashboardStats } from "@/lib/realtime-dashboard";

interface Activity {
  id: string;
  toPhone: string;
  status: string;
  content: string;
  timestamp: string;
  campaignName: string;
  customerName: string;
}

export function ExpandedActivityFeed({
  maxItems = 20,
  pollInterval = 5000
}: {
  maxItems?: number;
  pollInterval?: number;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<"all" | "DELIVERED" | "SENT" | "PENDING" | "FAILED">("all");

  const { stats, loading } = useRealtimeDashboardStats(pollInterval);

  useEffect(() => {
    if (stats?.recentActivities) {
      setActivities(stats.recentActivities);
    }
  }, [stats]);

  const filteredActivities = filter === "all"
    ? activities
    : activities.filter(a => a.status === filter);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      DELIVERED: { bg: "bg-green-100", text: "text-green-800", icon: "✅" },
      SENT: { bg: "bg-blue-100", text: "text-blue-800", icon: "📤" },
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      FAILED: { bg: "bg-red-100", text: "text-red-800", icon: "❌" }
    };
    return colors[status] || { bg: "bg-slate-100", text: "text-slate-800", icon: "📨" };
  };

  const getStatusStats = () => {
    const stats = {
      all: activities.length,
      DELIVERED: activities.filter(a => a.status === "DELIVERED").length,
      SENT: activities.filter(a => a.status === "SENT").length,
      PENDING: activities.filter(a => a.status === "PENDING").length,
      FAILED: activities.filter(a => a.status === "FAILED").length
    };
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <h2 className="text-2xl font-bold">📋 Activity Feed</h2>
        <p className="text-blue-100 text-sm mt-1">Real-time message delivery tracking</p>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex gap-2 flex-wrap">
          {(["all", "DELIVERED", "SENT", "PENDING", "FAILED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status === "all" ? "All" : status}
              <span className="ml-2 text-xs">({statusStats[status === "all" ? "all" : status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredActivities.slice(0, maxItems).map((activity) => {
              const { bg, text, icon } = getStatusColor(activity.status);
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-blue-300 transition-all"
                >
                  <div className="text-2xl flex-shrink-0">{icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">
                          {activity.customerName || activity.toPhone}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {activity.toPhone}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${bg} ${text}`}>
                        {activity.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 mb-2 line-clamp-2">
                      {activity.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="space-x-3">
                        <span className="inline-block">📢 {activity.campaignName}</span>
                      </div>
                      <span className="flex-shrink-0">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-3xl mb-4">📭</p>
            <p className="text-slate-600 font-medium">No activities to display</p>
            <p className="text-slate-400 text-sm mt-2">
              {filter === "all"
                ? "Start sending campaigns to see activity here"
                : `No ${filter} messages yet`}
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {activities.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{statusStats.DELIVERED}</p>
              <p className="text-xs text-slate-600 mt-1">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statusStats.SENT}</p>
              <p className="text-xs text-slate-600 mt-1">Sent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statusStats.PENDING}</p>
              <p className="text-xs text-slate-600 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statusStats.FAILED}</p>
              <p className="text-xs text-slate-600 mt-1">Failed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CompactActivityFeed({
  maxItems = 5
}: {
  maxItems?: number;
}) {
  const { stats, loading } = useRealtimeDashboardStats(5000);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Latest Activity</h3>
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : stats?.recentActivities && stats.recentActivities.length > 0 ? (
        <div className="space-y-2">
          {stats.recentActivities.slice(0, maxItems).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded border border-slate-200"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {activity.customerName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {activity.content}
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ml-2 flex-shrink-0 ${
                activity.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-800"
              }`}>
                {activity.status === "DELIVERED" ? "✓" : "..."}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-4 text-sm">No recent activity</p>
      )}
    </div>
  );
}
