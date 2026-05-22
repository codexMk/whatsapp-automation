'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/ui/StatsCard';
import { AppCard } from '@/components/ui/AppCard';
import Link from 'next/link';

interface Metrics {
  totalCustomers: number;
  totalCampaigns: number;
  messagesToday: number;
  messagesThisMonth: number;
  activeAutomations: number;
  successRate: number;
}

interface ActivityEntry {
  id: string;
  timestamp: string;
  type: string;
  status: string;
  description: string;
  details: {
    phone: string;
    customerName?: string;
    campaignName?: string;
    automationName?: string;
    preview: string;
  };
}

interface DashboardData {
  metrics: Metrics;
  activityTimeline: ActivityEntry[];
  summary: {
    hasCustomers: boolean;
    hasCampaigns: boolean;
    hasActivity: boolean;
  };
}

const statusColors: Record<string, string> = {
  SENT: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/insights');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, activityTimeline, summary } = data || {
    metrics: {
      totalCustomers: 0,
      totalCampaigns: 0,
      messagesToday: 0,
      messagesThisMonth: 0,
      activeAutomations: 0,
      successRate: 0,
    },
    activityTimeline: [],
    summary: {
      hasCustomers: false,
      hasCampaigns: false,
      hasActivity: false,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">📊 Admin Dashboard</h1>
          <p className="text-slate-600">Platform overview, metrics, and management tools</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
            Warning: {error}
          </div>
        )}

        {/* Platform Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📈 Platform Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              icon="👥"
              label="Total Customers"
              value={metrics.totalCustomers}
              description="Active customer contacts"
            />
            <StatsCard
              icon="📢"
              label="Total Campaigns"
              value={metrics.totalCampaigns}
              description="All campaigns across users"
            />
            <StatsCard
              icon="📤"
              label="Messages Today"
              value={metrics.messagesToday}
              description={`${metrics.messagesThisMonth} this month`}
            />
            <StatsCard
              icon="📬"
              label="Messages This Month"
              value={metrics.messagesThisMonth}
              description="Total platform messages"
            />
            <StatsCard
              icon="⚙️"
              label="Active Automations"
              value={metrics.activeAutomations}
              description="Running automations"
            />
            <StatsCard
              icon="✅"
              label="Success Rate"
              value={`${metrics.successRate}%`}
              description="Message delivery rate"
              trend={{
                value: metrics.successRate > 75 ? 5 : -3,
                direction: metrics.successRate > 75 ? 'up' : 'down',
              }}
            />
          </div>
        </div>

        {/* Admin Management Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">⚙️ Admin Modules</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* User Management */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-bold text-slate-900 mb-2">User Management</h3>
              <p className="text-sm text-slate-600 mb-4">View, search, suspend, and manage user accounts</p>
              <a
                href="/admin/users"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Manage Users
              </a>
            </div>

            {/* Campaign Monitoring */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="font-bold text-slate-900 mb-2">Campaign Monitoring</h3>
              <p className="text-sm text-slate-600 mb-4">View all campaigns across all users</p>
              <a
                href="/admin/campaigns"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Monitor Campaigns
              </a>
            </div>

            {/* Plan Management */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-bold text-slate-900 mb-2">Plan Management</h3>
              <p className="text-sm text-slate-600 mb-4">Create and manage subscription plans</p>
              <a
                href="/admin/plans"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Manage Plans
              </a>
            </div>

            {/* Template Management */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-bold text-slate-900 mb-2">Template Management</h3>
              <p className="text-sm text-slate-600 mb-4">Manage default platform templates</p>
              <a
                href="/admin/templates"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Manage Templates
              </a>
            </div>

            {/* Blog Management */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-slate-900 mb-2">Blog Management</h3>
              <p className="text-sm text-slate-600 mb-4">Create and publish blog posts</p>
              <a
                href="/admin/blogs"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Manage Blogs
              </a>
            </div>

            {/* Page Management */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="font-bold text-slate-900 mb-2">Page Management</h3>
              <p className="text-sm text-slate-600 mb-4">Manage static pages and content</p>
              <a
                href="/admin/pages"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Manage Pages
              </a>
            </div>

            {/* Analytics */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-slate-900 mb-2">Analytics</h3>
              <p className="text-sm text-slate-600 mb-4">View detailed platform analytics</p>
              <a
                href="/admin/analytics"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                View Analytics
              </a>
            </div>

            {/* Admin Management */}
            <div className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 transition bg-white">
              <div className="text-4xl mb-3">👨‍💼</div>
              <h3 className="font-bold text-slate-900 mb-2">Admin Management</h3>
              <p className="text-sm text-slate-600 mb-4">Create and manage admin accounts</p>
              <a
                href="/admin/admins"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center block"
              >
                Manage Admins
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        {summary.hasActivity && (
          <AppCard>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">📋 Recent Activity</h2>
              <p className="text-slate-600">Latest messages and events across the platform</p>
            </div>

            <div className="space-y-4">
              {activityTimeline.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                    {index !== activityTimeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200 my-2"></div>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">
                            {entry.details.customerName || entry.details.phone}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              statusColors[entry.status] || 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{entry.description}</p>
                        <div className="space-y-1 text-xs text-slate-500">
                          {entry.details.campaignName && (
                            <p>📢 Campaign: {entry.details.campaignName}</p>
                          )}
                          {entry.details.automationName && (
                            <p>⚙️ Automation: {entry.details.automationName}</p>
                          )}
                          <p className="italic">"{entry.details.preview}"</p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AppCard>
        )}

        {/* Logout Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/login');
              } catch (err) {
                console.error('Logout error:', err);
              }
            }}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Logout 👋
          </button>
        </div>
      </div>
    </div>
  );
}
