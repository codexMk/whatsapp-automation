'use client';

import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

interface Analytics {
  totals: {
    users: number;
    activeUsers: number;
    campaigns: number;
    messagesSent: number;
    newUsersToday: number;
  };
  topIndustries: Array<{
    category: string;
    count: number;
  }>;
  mostUsedTemplates: Array<{
    name: string;
    usageCount: number;
  }>;
  dailyTrends: Array<{
    date: string;
    messages: number;
    campaigns: number;
    newUsers: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      // Provide default structure if response is missing data
      const analyticsData = data || {
        totals: {
          users: 0,
          activeUsers: 0,
          campaigns: 0,
          messagesSent: 0,
          newUsersToday: 0,
        },
        topIndustries: [],
        mostUsedTemplates: [],
        dailyTrends: [],
      };
      setAnalytics(analyticsData);
      setError('');
    } catch (err) {
      console.error('[ANALYTICS] Error fetching analytics:', err);
      // Set default empty analytics on error
      setAnalytics({
        totals: {
          users: 0,
          activeUsers: 0,
          campaigns: 0,
          messagesSent: 0,
          newUsersToday: 0,
        },
        topIndustries: [],
        mostUsedTemplates: [],
        dailyTrends: [],
      });
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Platform Analytics"
        description="Monitor platform-wide usage and trends"
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading && !analytics ? (
        <div className="text-center py-8 text-gray-500">Loading analytics...</div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Users</div>
              <div className="text-3xl font-bold text-gray-900">
                {analytics?.totals?.users?.toLocaleString?.() || '0'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-1">Active Users</div>
              <div className="text-3xl font-bold text-green-600">
                {analytics?.totals?.activeUsers?.toLocaleString?.() || '0'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Campaigns</div>
              <div className="text-3xl font-bold text-blue-600">
                {analytics?.totals?.campaigns?.toLocaleString?.() || '0'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-1">Messages Sent</div>
              <div className="text-3xl font-bold text-purple-600">
                {analytics?.totals?.messagesSent?.toLocaleString?.() || '0'}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-1">New Users Today</div>
              <div className="text-3xl font-bold text-orange-600">
                {analytics?.totals?.newUsersToday || '0'}
              </div>
            </div>
          </div>

          {/* Top Industries */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Top Industries</h3>
            <div className="space-y-3">
              {!analytics?.topIndustries || analytics.topIndustries.length === 0 ? (
                <div className="text-gray-500 text-sm">No data available</div>
              ) : (
                analytics.topIndustries.map((industry, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {industry?.category?.replace('_', ' ') || 'Unknown'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (industry?.count || 0) /
                              Math.max(
                                1,
                                ...((analytics?.topIndustries || []).map((i) => i?.count || 0) || [0])
                              ) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-gray-900">
                      {industry?.count || '0'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Most Used Templates */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Most Used Templates</h3>
            <div className="space-y-3">
              {!analytics?.mostUsedTemplates || analytics.mostUsedTemplates.length === 0 ? (
                <div className="text-gray-500 text-sm">No data available</div>
              ) : (
                analytics.mostUsedTemplates.map((template, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {template?.name || 'Unknown'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (template?.usageCount || 0) /
                              Math.max(
                                1,
                                ...((analytics?.mostUsedTemplates || []).map((t) => t?.usageCount || 0) || [0])
                              ) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-gray-900">
                      {template?.usageCount || '0'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daily Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Daily Trends (Last 7 Days)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Messages
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Campaigns
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      New Users
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {!analytics?.dailyTrends || analytics.dailyTrends.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-gray-500 text-sm">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    analytics.dailyTrends.map((trend, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {trend?.date ? new Date(trend.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {(trend?.messages || 0).toLocaleString?.() || '0'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {trend?.campaigns || '0'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {trend?.newUsers || '0'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
