import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { AppCard } from "@/components/ui/AppCard";
import { CampaignCreatorFlow } from "@/components/ui/CampaignCreatorFlow";
import { listCustomers } from "@/lib/customers";
import { listTemplates } from "@/lib/templates";
import { getSessionUserId } from "@/lib/session-server";

export default async function NewCampaignPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const [customers, templates] = await Promise.all([
    listCustomers(userId),
    listTemplates(userId)
  ]);

  return (
    <PageContainer>
      <PageHeader
        title="Create Campaign"
        description="Set up a professional WhatsApp broadcast campaign"
      />

      {templates.length === 0 || customers.length === 0 ? (
        <AppCard>
          <div className="text-center py-12">
            {templates.length === 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Create a Template First</h3>
                <p className="text-slate-600 mb-4">You need at least one template to create a campaign.</p>
                <a
                  href="/dashboard/templates/new"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-bold rounded-lg transition"
                >
                  Create Template
                </a>
              </div>
            )}
            {customers.length === 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Add Customers First</h3>
                <p className="text-slate-600 mb-4">You need at least one customer to create a campaign.</p>
                <a
                  href="/dashboard/customers/new"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-bold rounded-lg transition"
                >
                  Add Customers
                </a>
              </div>
            )}
          </div>
        </AppCard>
      ) : (
        <CampaignCreatorFlow customers={customers} templates={templates} />
      )}
    </PageContainer>
  );
}

