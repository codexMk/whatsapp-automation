import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getCampaignById, updateCampaignStatus } from "@/lib/campaigns";
import { getSessionUserId } from "@/lib/session-server";
import { CampaignStatus } from "@prisma/client";

type PageProps = {
  params: {
    id: string;
  };
};

async function updateStatusAction(formData: FormData) {
  "use server";

  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const id = (formData.get("id") ?? "").toString();
  const status = (formData.get("status") ?? "").toString() as CampaignStatus;

  await updateCampaignStatus(userId, id, status);
  revalidatePath(`/dashboard/campaigns/${id}`);
  revalidatePath("/dashboard/campaigns");
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const campaign = await getCampaignById(userId, params.id);
  if (!campaign) {
    notFound();
  }

  const totalMessages = campaign.messageLogs.length;

  return (
    <PageContainer>
      <PageHeader
        title={campaign.name}
        description="Campaign details and logged messages."
        action={
          <form action={updateStatusAction} className="flex items-center gap-3">
            <input type="hidden" name="id" value={campaign.id} />
            <select
              name="status"
              defaultValue={campaign.status}
              className="rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-700 to-blue-600 px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {Object.values(CampaignStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 font-bold">
              Update
            </Button>
          </form>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <AppCard>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Template</p>
          <p className="mt-4 text-2xl font-black text-slate-900">
            {campaign.template?.name || "-"}
          </p>
        </AppCard>
        <AppCard>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Total Messages</p>
          <p className="mt-4 text-5xl font-black text-blue-600">{totalMessages}</p>
        </AppCard>
        <AppCard>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Created</p>
          <p className="mt-4 text-sm text-slate-900 font-bold">
            {campaign.createdAt.toLocaleString?.() ?? "-"}
          </p>
        </AppCard>
      </div>

      {/* Message Preview */}
      <AppCard>
        <h3 className="text-2xl font-black text-slate-900 mb-6">Message Preview</h3>
        <div className="rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 p-8 border-2 border-slate-200">
          <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
            {campaign.template?.content || "No template content."}
          </p>
        </div>
      </AppCard>

      {/* Back Link */}
      <div>
        <a href="/dashboard/campaigns" className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline">
          ← Back to Campaigns
        </a>
      </div>
    </PageContainer>
  );
}

