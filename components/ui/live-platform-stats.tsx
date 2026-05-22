"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/stats-utils";

interface PlatformStats {
  totalMessagesSent: number;
  totalActiveBusinesses: number;
  deliveryRate: number;
  totalCampaigns: number;
  activeUsers: number;
  timestamp: string;
}

interface AnimatedStatProps {
  label: string;
  value: number;
  format: (val: number) => string;
  suffix?: string;
  isPercentage?: boolean;
}

/**
 * AnimatedStat - Individual stat with animation
 */
function AnimatedStat({ 
  label, 
  value, 
  format, 
  suffix = "", 
  isPercentage = false 
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 800;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const currentValue = Math.floor(value * easeOutQuad);

      setDisplayValue(currentValue);

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="animate-slide-up">
      <div className="text-5xl font-black text-white">
        {format(displayValue)}{suffix}
      </div>
      <p className="text-blue-100 font-semibold mt-2">{label}</p>
    </div>
  );
}

/**
 * StatsSkeleton - Loading skeleton for stats
 */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-8 text-center">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-14 bg-blue-500/30 rounded-lg mb-3"></div>
          <div className="h-5 bg-blue-500/20 rounded w-24 mx-auto"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * LivePlatformStats - Main stats component with auto-refresh
 */
export function LivePlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch("/api/public/platform-stats", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setStats(data.data);
        setLastUpdated(new Date());
      } else if (data.data) {
        // Even if success is false, use fallback data if available
        setStats(data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("[LIVE_STATS] Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Failed to load statistics");
      
      // Keep showing previous data if available
      if (!stats) {
        // Set default fallback values to prevent UI breaking
        setStats({
          totalMessagesSent: 0,
          totalActiveBusinesses: 0,
          deliveryRate: 0,
          totalCampaigns: 0,
          activeUsers: 0,
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [stats]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <StatsSkeleton />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-blue-100 text-lg">Unable to load live statistics</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-3 gap-8 text-center">
        <AnimatedStat
          label="Messages Sent Daily"
          value={stats.totalMessagesSent}
          format={formatNumber}
          suffix="+"
        />
        <AnimatedStat
          label="Active Businesses"
          value={stats.totalActiveBusinesses}
          format={formatNumber}
          suffix="+"
        />
        <AnimatedStat
          label="Delivery Rate"
          value={stats.deliveryRate}
          format={(val) => val.toString()}
          suffix="%"
          isPercentage={true}
        />
      </div>

      {/* Optional: Show last updated time */}
      {lastUpdated && (
        <div className="text-center mt-6 text-blue-100 text-sm opacity-70">
          Last updated: {lastUpdated.toLocaleTimeString()}
          {error && (
            <span className="block text-yellow-200 text-xs mt-1">
              (Using cached data - connection issue)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
