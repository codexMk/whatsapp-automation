'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/ui/StatsCard';
import { AppCard } from '@/components/ui/AppCard';
import { OnboardingChecklist } from '@/components/ui/OnboardingChecklist';
import { RecommendedTemplates } from '@/components/ui/RecommendedTemplates';
import { VerificationCheck } from '@/components/layout/verification-check';

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

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  completed: boolean;
  actionLabel: string;
  actionPath: string;
}

interface RecommendedTemplate {
  name: string;
  description: string;
  content: string;
  icon: string;
  useCase: string;
}

interface DashboardData {
  metrics: Metrics;
  activityTimeline: ActivityEntry[];
  summary: {
    hasCustomers: boolean;
    hasCampaigns: boolean;
    hasActivity: boolean;
  };
  onboarding: {
    checklist: ChecklistItem[];
  };
  recommendations: {
    templates: RecommendedTemplate[];
  };
}

const statusColors: Record<string, string> = {
  SENT: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/dashboard-metrics');
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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <AppCard>
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold">{error || 'Failed to load dashboard'}</p>
            </div>
          </AppCard>
        </div>
      </div>
    );
  }

  const { metrics, activityTimeline, summary, onboarding, recommendations } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">📊 Dashboard</h1>
          <p className="text-slate-600">Your WhatsApp automation overview and insights</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            description="All campaigns created"
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
            description="Total messages sent"
          />
          <StatsCard
            icon="⚙️"
            label="Active Automations"
            value={metrics.activeAutomations}
            description="Running automatically"
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

        {/* Onboarding Checklist */}
        <OnboardingChecklist items={onboarding.checklist} />

        {/* Recommended Templates */}
        <RecommendedTemplates templates={recommendations.templates} />

        {!summary.hasCustomers && (
          <AppCard className="mb-8 bg-blue-50 border-blue-200">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Customers Yet</h3>
              <p className="text-slate-600 mb-4">
                Start by uploading or creating your first customer contact list
              </p>
              <button
                onClick={() => router.push('/dashboard/customers')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Add Customers
              </button>
            </div>
          </AppCard>
        )}

        {!summary.hasCampaigns && (
          <AppCard className="mb-8 bg-purple-50 border-purple-200">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Campaigns Yet</h3>
              <p className="text-slate-600 mb-4">
                Create your first campaign to start sending WhatsApp messages
              </p>
              <button
                onClick={() => router.push('/dashboard/campaigns')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
              >
                Create Campaign
              </button>
            </div>
          </AppCard>
        )}

        {/* Activity Timeline */}
        {summary.hasActivity && (
          <AppCard className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">📋 Recent Activity</h2>
              <p className="text-slate-600">Latest messages and events</p>
            </div>

            <div className="space-y-4">
              {activityTimeline.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0"
                >
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                    {index !== activityTimeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200 my-2"></div>
                    )}
                  </div>

                  {/* Content */}
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

        {!summary.hasActivity && (
          <AppCard className="text-center py-12 bg-slate-50">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Activity Yet</h3>
            <p className="text-slate-600">
              Your activity timeline will appear here once you send messages
            </p>
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

