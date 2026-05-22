import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/InputField";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { createTemplate } from "@/lib/templates";
import { getSessionUserId } from "@/lib/session-server";

async function createTemplateAction(formData: FormData) {
  "use server";

  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const name = (formData.get("name") ?? "").toString().trim();
  const category = (formData.get("category") ?? "").toString().trim() || undefined;
  const content = (formData.get("content") ?? "").toString();
  const variablesRaw = (formData.get("variables") ?? "").toString();

  const variables = variablesRaw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const template = await createTemplate(userId, {
    name,
    category,
    content,
    variables
  });

  revalidatePath("/dashboard/templates");
  redirect(`/dashboard/templates/${template.id}`);
}

export default function NewTemplatePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Create Template"
        description="Define a reusable WhatsApp message template with optional dynamic variables."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppCard>
            <form action={createTemplateAction} className="space-y-8">
              <InputField
                label="Template Name"
                name="name"
                placeholder="e.g. Appointment reminder"
                required
                helperText="Give your template a clear name"
              />

              <InputField
                label="Category"
                name="category"
                placeholder="e.g. Greeting, Reminder, Followup"
                helperText="Categorize your templates for easy finding"
              />

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  Message Content
                </label>
                <textarea
                  name="content"
                  required
                  className="min-h-[160px] w-full rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-700 to-blue-600 px-4 py-3 text-white placeholder:text-blue-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Hi {{name}}, this is a reminder for your appointment on {{date}} at {{time}}."
                />
                <p className="text-xs text-slate-500">Use {"{"}{"variable_name"}{"}"}  to add dynamic content</p>
              </div>

              <InputField
                label="Variables"
                name="variables"
                placeholder="name, date, time"
                helperText="Comma-separated list of variables used in your message"
              />

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 font-bold">
                  📝 Save Template
                </Button>
                <a
                  href="/dashboard/templates"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </a>
              </div>
            </form>
          </AppCard>
        </div>

        {/* Tips Sidebar */}
        <div className="space-y-6">
          <AppCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <div className="flex gap-3 mb-4">
              <div className="text-3xl">💡</div>
              <h3 className="font-black text-white text-lg">Template Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Keep messages concise and clear</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Use variables for personalization</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Save commonly used templates</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Test templates with sample data</span>
              </li>
            </ul>
          </AppCard>

          <AppCard className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <div className="flex gap-3">
              <div className="text-3xl">🎨</div>
              <div>
                <h3 className="font-black text-white text-lg">Template Preview</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Variables like {"{"}name{"}"} and {"{"}date{"}"} will be replaced with actual customer data when messages are sent.
                </p>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </PageContainer>
  );
}

