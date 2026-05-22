import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { listCampaigns } from "@/lib/campaigns";
import { getSessionUserId } from "@/lib/session-server";

export default async function CampaignsPage() {
  const userId = await getSessionUserId();

  if (!userId) {
    return (
      <PageContainer>
        <PageHeader
          title="Campaigns"
          description="Create and manage WhatsApp broadcast campaigns."
        />
        <AppCard>
          <p className="text-slate-600 text-center py-8">
            You must be logged in to view campaigns.
          </p>
        </AppCard>
      </PageContainer>
    );
  }

  const campaigns = await listCampaigns(userId);

  return (
    <PageContainer>
      <PageHeader
        title="Campaigns"
        description="Create and manage WhatsApp broadcast campaigns."
        action={
          <a href="/dashboard/campaigns/new" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-bold rounded-lg text-white transition-all">
            + New Campaign
          </a>
        }
      />

      {campaigns.length === 0 ? (
        <AppCard>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-center">
            <div className="text-6xl mb-6 animate-bounce">📢</div>
            <h3 className="text-2xl font-black text-slate-900">No campaigns yet</h3>
            <p className="mt-4 text-slate-600 max-w-sm mx-auto text-lg">
              Create your first campaign to start sending WhatsApp messages to your customers.
            </p>
            <a href="/dashboard/campaigns/new" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-bold rounded-lg text-white transition-all">
              Create Your First Campaign
            </a>
          </div>
        </AppCard>
      ) : (
        <AppCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Campaign Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Template</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        className="font-bold text-blue-600 hover:text-blue-700"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {campaign.template?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {campaign.createdAt.toLocaleDateString?.() ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        className="text-blue-600 hover:text-blue-700 font-bold text-xs hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AppCard>
      )}
    </PageContainer>
  );
}

