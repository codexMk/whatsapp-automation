import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/InputField";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getCustomerById, updateCustomer } from "@/lib/customers";
import { getSessionUserId } from "@/lib/session-server";

type PageProps = {
  params: {
    id: string;
  };
};

async function updateCustomerAction(formData: FormData) {
  "use server";

  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const id = (formData.get("id") ?? "").toString();
  const name = (formData.get("name") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const tagsRaw = (formData.get("tags") ?? "").toString();

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await updateCustomer(userId, id, {
    name,
    phone,
    tags
  });

  revalidatePath(`/dashboard/customers/${id}`);
  revalidatePath("/dashboard/customers");
}

export default async function CustomerProfilePage({ params }: PageProps) {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect("/login");
  }

  const customer = await getCustomerById(userId, params.id);
  if (!customer) {
    notFound();
  }

  const tagsString = customer.tags?.join(", ") ?? "";

  return (
    <PageContainer>
      <PageHeader
        title={customer.name}
        description="Customer profile and attributes used for WhatsApp targeting."
      />

      <AppCard>
        <form action={updateCustomerAction} className="space-y-8">
          <input type="hidden" name="id" value={customer.id} />

          <InputField
            label="Name"
            name="name"
            defaultValue={customer.name}
            required
            helperText="Customer's full name"
          />

          <InputField
            label="Phone"
            name="phone"
            defaultValue={customer.phone}
            required
            helperText="Contact number with country code"
          />

          <InputField
            label="Tags"
            name="tags"
            defaultValue={tagsString}
            placeholder="e.g. vip, premium, interested"
            helperText="Comma separated list for organizing customers"
          />

          <div className="pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 font-bold">
              💾 Save Changes
            </Button>
          </div>
        </form>
      </AppCard>

      {/* Delete Option */}
      <AppCard className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-red-100/50">
        <div className="flex items-start gap-6">
          <div className="text-5xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-red-900">Delete Customer</h3>
            <p className="mt-3 text-slate-700 text-sm leading-relaxed">
              This action will remove this customer from your list. All associated campaign history will be preserved, but they won't be targetable in new campaigns. This cannot be undone.
            </p>
            <button className="mt-6 rounded-lg bg-red-600 hover:bg-red-700 transition-colors px-6 py-3 text-sm font-bold text-white">
              🗑️ Delete Customer
            </button>
          </div>
        </div>
      </AppCard>

      {/* Back Link */}
      <div>
        <a href="/dashboard/customers" className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline">
          ← Back to Customers
        </a>
      </div>
    </PageContainer>
  );
}


