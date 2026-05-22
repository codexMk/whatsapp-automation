"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppCard } from "@/components/ui/AppCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { getEmptyState, getTemplatesHint } from "@/lib/category-config";
import { useCategoryOrNull } from "@/lib/category-hooks";
import ReadyMadeTemplatesSection from "@/components/templates/ReadyMadeTemplatesSection";

interface Template {
  id: string;
  userId: string;
  name: string;
  category: string | null;
  content: string;
  variables: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function TemplatesPage() {
  const category = useCategoryOrNull();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("[TEMPLATES-PAGE] Loading templates...");
        // Fetch user ID from API
        const meResponse = await fetch("/api/user/me");

        console.log("[TEMPLATES-PAGE] /api/user/me response status:", meResponse.status);

        if (!meResponse.ok) {
          console.log("[TEMPLATES-PAGE] Not authenticated, status:", meResponse.status);
          setLoading(false);
          return;
        }

        const meData = await meResponse.json();
        console.log("[TEMPLATES-PAGE] User data:", meData);
        const uid = meData.user?.id ?? null;
        setUserId(uid);

        if (!uid) {
          console.log("[TEMPLATES-PAGE] No UID in response");
          setLoading(false);
          return;
        }

        console.log("[TEMPLATES-PAGE] Fetching templates from API for user:", uid);
        // Call the templates API endpoint instead of the server function
        const templatesResponse = await fetch("/api/templates");
        console.log("[TEMPLATES-PAGE] Templates API response status:", templatesResponse.status);

        if (!templatesResponse.ok) {
          console.log("[TEMPLATES-PAGE] Failed to fetch templates");
          setLoading(false);
          return;
        }

        const templatesData = await templatesResponse.json();
        console.log("[TEMPLATES-PAGE] Templates data:", templatesData);
        setTemplates(templatesData.templates as Template[]);
      } catch (error) {
        console.error("[TEMPLATES-PAGE] Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const emptyState = getEmptyState(category, "templates");
  const hint = getTemplatesHint(category);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Templates"
          description="Reusable WhatsApp message templates for campaigns and automations."
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
          title="Templates"
          description="Reusable WhatsApp message templates for campaigns and automations."
        />
        <AppCard>
          <p className="text-slate-600 text-center py-8">
            You must be logged in to view templates.
          </p>
        </AppCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Templates"
        description="Reusable WhatsApp message templates for campaigns and automations."
        action={
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white transition hover:bg-blue-700"
          >
            + Create Template
          </Link>
        }
      />

      {/* Ready-Made Templates Section */}
      <AppCard className="mb-8">
        <ReadyMadeTemplatesSection />
      </AppCard>

      {templates.length === 0 ? (
        <AppCard>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-center">
            <div className="text-6xl mb-6 animate-bounce">{emptyState.icon}</div>
            <h3 className="text-2xl font-black text-slate-900">{emptyState.heading}</h3>
            <p className="mt-4 text-slate-600 max-w-sm mx-auto text-lg">
              {emptyState.description}
            </p>
            {hint && (
              <p className="mt-4 text-sm text-slate-600 italic max-w-md mx-auto">
                💡 {hint}
              </p>
            )}
            <Link
              href="/dashboard/templates/new"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-bold text-white transition hover:bg-blue-700"
            >
              Create Your First Template
            </Link>
          </div>
        </AppCard>
      ) : (
        <AppCard>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">Your Templates</h2>
            <p className="text-slate-600 text-sm mt-1">Manage your custom templates</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Template Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Variables</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white bg-gradient-to-br from-blue-700 to-blue-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {templates.map((template) => {
                  const vars =
                    Array.isArray(template.variables) && template.variables.length > 0
                      ? template.variables.join(", ")
                      : "-";

                  return (
                    <tr key={template.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/templates/${template.id}`}
                          className="font-bold text-blue-600 hover:text-blue-700"
                        >
                          {template.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {template.category ? (
                          <span className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {template.category}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">{vars}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/templates/${template.id}`}
                          className="text-blue-600 hover:text-blue-700 font-bold text-xs hover:underline"
                        >
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AppCard>
      )}
    </PageContainer>
  );
}

