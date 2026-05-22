import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/InputField";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { createCustomer } from "@/lib/customers";
import { getSessionUserId } from "@/lib/session-server";

async function createCustomerAction(formData: FormData) {
  "use server";

  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const name = (formData.get("name") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const tagsRaw = (formData.get("tags") ?? "").toString();

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const customer = await createCustomer(userId, {
    name,
    phone,
    tags
  });

  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers/${customer.id}`);
}

export default function NewCustomerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Add Customer"
        description="Create a new customer that can be targeted in WhatsApp campaigns and automations."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppCard>
            <form action={createCustomerAction} className="space-y-8">
              <InputField
                label="Full Name"
                name="name"
                placeholder="e.g. John Doe"
                required
                helperText="Customer's full name"
              />

              <InputField
                label="Phone Number"
                name="phone"
                placeholder="+1 555 000 0000"
                required
                helperText="Include country code for international numbers"
              />

              <InputField
                label="Tags"
                name="tags"
                placeholder="e.g. vip, premium, interested"
                helperText="Separate multiple tags with commas. Use tags to organize customers."
              />

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 font-bold">
                  👤 Save Customer
                </Button>
                <a
                  href="/dashboard/customers"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </a>
              </div>
            </form>
          </AppCard>
        </div>

        {/* Tips Sidebar */}
        <div>
          <AppCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <div className="flex gap-3 mb-4">
              <div className="text-3xl">💡</div>
              <h3 className="font-black text-slate-900 text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Use consistent phone number formats</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Include country code for easier management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Use tags to segment customers by type</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Import multiple customers at once later</span>
              </li>
            </ul>
          </AppCard>
        </div>
      </div>
    </PageContainer>
  );
}

