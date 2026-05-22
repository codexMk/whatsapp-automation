"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getEmptyState, getLabel } from "@/lib/category-config";
import { useCategoryOrNull } from "@/lib/category-hooks";

interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function CustomersPage() {
  const category = useCategoryOrNull();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch user ID from API
        const meResponse = await fetch("/api/user/me");

        if (!meResponse.ok) {
          setLoading(false);
          return;
        }

        const meData = await meResponse.json();
        const uid = meData.userId;
        setUserId(uid);

        if (!uid) {
          setLoading(false);
          return;
        }

        // Call the customers API endpoint instead of server function
        const customersResponse = await fetch("/api/customers");
        if (!customersResponse.ok) {
          setLoading(false);
          return;
        }

        const customersData = await customersResponse.json();
        setCustomers(customersData.customers as Customer[]);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const emptyState = getEmptyState(category, "customers");
  const customerLabel = getLabel(category, "customer");
  const customersLabel = getLabel(category, "customers");

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title={customersLabel}
          description={`Manage contacts synced with your WhatsApp automation.`}
        />
        <AppCard>
          <div className="text-center py-8">Loading...</div>
        </AppCard>
      </PageContainer>
    );
  }

  if (!userId) {
    return (
      <PageContainer>
        <PageHeader
          title={customersLabel}
          description="Manage contacts synced with your WhatsApp automation."
        />
        <AppCard>
          <p className="text-slate-600 text-center py-8">
            You must be logged in to view {customersLabel.toLowerCase()}.
          </p>
        </AppCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={customersLabel}
        description="Manage contacts synced with your WhatsApp automation."
        action={
          <a href="/dashboard/customers/new" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 text-base font-bold rounded-lg text-white transition-all">
            + Add {customerLabel}
          </a>
        }
      />

      {customers.length === 0 ? (
        <AppCard>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-center">
            <div className="text-6xl mb-6 animate-bounce">{emptyState.icon}</div>
            <h3 className="text-2xl font-black text-slate-900">{emptyState.heading}</h3>
            <p className="mt-4 text-slate-600 max-w-sm mx-auto text-lg">
              {emptyState.description}
            </p>
            <a href="/dashboard/customers/new" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-bold rounded-lg text-white transition-all">
              Add Your First {customerLabel}
            </a>
          </div>
        </AppCard>
      ) : (
        <AppCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Tags</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="font-bold text-blue-600 hover:text-blue-700"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{customer.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.tags && customer.tags.length > 0
                          ? customer.tags.map((tag) => (
                              <span key={tag} className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                {tag}
                              </span>
                            ))
                          : <span className="text-slate-400">-</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
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

