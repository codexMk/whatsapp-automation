import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export function StatsCard({ icon, label, value, description, trend }: StatsCardProps) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all-smooth hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">{label}</p>
          <p className="mt-4 text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
            {value}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <p className="text-sm text-slate-500">{description}</p>
            {trend && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  trend.direction === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 p-5 text-5xl group-hover:scale-125 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  );
}
