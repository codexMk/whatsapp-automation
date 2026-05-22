import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/InputField";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getTemplateById, updateTemplate } from "@/lib/templates";
import { getSessionUserId } from "@/lib/session-server";

type PageProps = {
  params: {
    id: string;
  };
};

async function updateTemplateAction(formData: FormData) {
  "use server";

  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const id = (formData.get("id") ?? "").toString();
  const name = (formData.get("name") ?? "").toString().trim();
  const category = (formData.get("category") ?? "").toString().trim() || undefined;
  const content = (formData.get("content") ?? "").toString();
  const variablesRaw = (formData.get("variables") ?? "").toString();

  const variables = variablesRaw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  await updateTemplate(userId, id, {
    name,
    category,
    content,
    variables
  });

  revalidatePath(`/dashboard/templates/${id}`);
  revalidatePath("/dashboard/templates");
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const template = await getTemplateById(userId, params.id);
  if (!template) {
    notFound();
  }

  const variablesArray =
    Array.isArray(template.variables) && template.variables.length > 0
      ? (template.variables as string[])
      : [];
  const variablesString = variablesArray.join(", ");

  return (
    <PageContainer>
      <PageHeader
        title={template.name}
        description="Template details and message content used across campaigns and automations."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppCard>
            <form action={updateTemplateAction} className="space-y-8">
              <input type="hidden" name="id" value={template.id} />

              <InputField
                label="Template Name"
                name="name"
                defaultValue={template.name}
                required
                helperText="Clear, descriptive name for your template"
              />

              <InputField
                label="Category"
                name="category"
                defaultValue={template.category || ""}
                placeholder="e.g. Greeting, Reminder, Followup"
                helperText="Optional category for organization"
              />

              <div className="space-y-3">
                <label className="block text-sm font-bold text-white">Message Content</label>
                <textarea
                  name="content"
                  required
                  defaultValue={template.content}
                  placeholder="Write your WhatsApp message here..."
                  className="min-h-[160px] w-full rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-700 to-blue-600 px-4 py-3 text-white placeholder:text-blue-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-slate-500">
                  Use {'{'}variable_name{'}'} for dynamic content
                </p>
              </div>

              <InputField
                label="Variables"
                name="variables"
                defaultValue={variablesString}
                placeholder="e.g. name, date, time"
                helperText="Comma-separated list available in campaigns"
              />

              <div className="pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 font-bold">
                  💾 Save Changes
                </Button>
              </div>
            </form>
          </AppCard>
        </div>

        {/* Preview Sidebar */}
        <div>
          <AppCard className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <div className="flex gap-3 mb-6">
              <div className="text-4xl">👁️</div>
              <h3 className="font-black text-slate-900 text-lg">Preview</h3>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 mb-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Message:</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {template.content}
              </p>
            </div>
            {variablesArray.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Variables:</p>
                <div className="space-y-2">
                  {variablesArray.map((v) => (
                    <div key={v} className="text-xs bg-white rounded px-3 py-2 border border-slate-200 font-mono font-bold text-slate-700">
                      {`{{${v}}}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AppCard>
        </div>
      </div>

      {/* Back Link */}
      <div>
        <a href="/dashboard/templates" className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline">
          ← Back to Templates
        </a>
      </div>
    </PageContainer>
  );
}

