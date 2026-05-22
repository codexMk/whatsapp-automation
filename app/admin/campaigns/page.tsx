'use client';

import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { InputField } from '@/components/ui/InputField';

interface Campaign {
  id: string;
  name: string;
  status: string;
  category: string;
  userId: string;
  userEmail: string;
  businessName: string;
  templateId: string;
  templateName: string;
  messageStats: {
    total: number;
    sent: number;
    failed: number;
  };
  createdAt: string;
  startedAt: string | null;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/campaigns?${params}`);
      if (!response.ok) throw new Error('Failed to fetch campaigns');

      const data = await response.json();
      setCampaigns(data.campaigns || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSuspend = async (campaignId: string) => {
    if (!confirm('Are you sure you want to suspend this campaign?')) return;

    try {
      setActionLoading(campaignId);
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          action: 'suspend',
        }),
      });

      if (!response.ok) throw new Error('Failed to suspend campaign');
      fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend campaign');
    } finally {
      setActionLoading('');
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    `${campaign.name} ${campaign.userEmail} ${campaign.businessName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Campaign Monitoring"
        description="Monitor and manage all platform campaigns"
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <InputField
          label="Search Campaigns"
          placeholder="Search by name, email, or business..."
          value={searchTerm}
          onChange={(e: any) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading campaigns...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900">{campaign.userEmail}</div>
                      <div className="text-gray-600 text-xs">{campaign.businessName}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          campaign.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'PAUSED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : campaign.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="text-sm font-medium">{campaign.messageStats.total}</div>
                      <div className="text-xs text-gray-500">
                        ✓ {campaign.messageStats.sent} ✗{' '}
                        {campaign.messageStats.failed}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {campaign.templateName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {campaign.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleSuspend(campaign.id)}
                          disabled={actionLoading === campaign.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {actionLoading === campaign.id ? 'Suspending...' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filteredCampaigns.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page {page}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={filteredCampaigns.length < 10}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
