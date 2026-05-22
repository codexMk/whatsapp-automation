"use client";

import { useRealtimeDashboardStats, RealtimeStatsCard, ActivityFeed, CampaignProgress } from "@/lib/realtime-dashboard";
import { useState } from "react";

export function RealtimeDashboardSection() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const pollInterval = autoRefresh ? 5000 : undefined;

  const { stats, loading, error, lastUpdate } = useRealtimeDashboardStats(
    pollInterval || 0,
    undefined
  );

  if (!stats && loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Error loading real-time data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700">Auto-refresh (5s)</span>
          </label>
          {lastUpdate && (
            <span className="text-xs text-slate-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealtimeStatsCard
          label="Total Customers"
          value={stats.stats.totalCustomers}
          icon="👥"
          isLoading={loading}
        />
        <RealtimeStatsCard
          label="Total Campaigns"
          value={stats.stats.totalCampaigns}
          icon="📢"
          isLoading={loading}
        />
        <RealtimeStatsCard
          label="Messages Sent"
          value={stats.stats.messagesSent}
          icon="📤"
          isLoading={loading}
        />
        <RealtimeStatsCard
          label="Active Automations"
          value={stats.stats.activeAutomations}
          icon="⚙️"
          isLoading={loading}
        />
      </div>

      {/* Activity & Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={stats.recentActivities} isLoading={loading} />
        <CampaignProgress campaigns={stats.campaignProgress} isLoading={loading} />
      </div>
    </div>
  );
}
