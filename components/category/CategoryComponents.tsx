"use client";

import { useCategoryOrNull } from "@/lib/category-hooks";
import { getRecommendedTemplates } from "@/lib/category-config";
import { AppCard } from "./AppCard";

/**
 * CategoryTemplateRecommendations
 *
 * Shows category-specific template recommendations
 * - Displays nothing if no category selected
 * - Shows recommendations relevant to user's industry
 * - No UI changes, just behavioral customization
 *
 * Usage:
 * <CategoryTemplateRecommendations />
 */
export function CategoryTemplateRecommendations() {
  const category = useCategoryOrNull();
  const templates = getRecommendedTemplates(category);

  // Show nothing if no category or no templates
  if (!templates.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="px-4">
        <h3 className="text-lg font-bold text-slate-900">
          📋 Recommended Templates for you
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Get started with pre-built templates tailored to {category}
        </p>
      </div>

      <div className="space-y-2">
        {templates.slice(0, 3).map((template) => (
          <AppCard key={template.useCase}>
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{template.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{template.name}</h4>
                <p className="text-sm text-slate-600 mt-1">
                  {template.description}
                </p>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Use for: {template.useCase}
                </p>
              </div>
              <button className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors">
                Use Template
              </button>
            </div>
          </AppCard>
        ))}
      </div>

      {templates.length > 3 && (
        <div className="px-4">
          <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">
            View all {templates.length} templates →
          </button>
        </div>
      )}
    </section>
  );
}

/**
 * CategoryQuickActionsSection
 *
 * Shows category-specific suggested actions
 * Helps users get started with common tasks for their industry
 *
 * Usage:
 * <CategoryQuickActionsSection />
 */
export function CategoryQuickActionsSection() {
  const category = useCategoryOrNull();

  // If no category, show generic quick start
  if (!category) {
    return (
      <section className="space-y-3">
        <div className="px-4">
          <h3 className="text-lg font-bold text-slate-900">
            🚀 Quick Start
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Select your business category to get tailored suggestions
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div className="px-4">
        <h3 className="text-lg font-bold text-slate-900">
          🚀 Get Started
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Common first steps for {category} businesses
        </p>
      </div>

      <div className="space-y-2">
        {/* Placeholder for quick actions - can be extended */}
        <AppCard>
          <div className="flex items-start gap-4">
            <div className="text-3xl">📋</div>
            <div>
              <h4 className="font-bold text-slate-900">Create First Template</h4>
              <p className="text-sm text-slate-600 mt-1">
                Use recommended template for your category
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg">
              Start
            </button>
          </div>
        </AppCard>

        <AppCard>
          <div className="flex items-start gap-4">
            <div className="text-3xl">👥</div>
            <div>
              <h4 className="font-bold text-slate-900">Import Your Contacts</h4>
              <p className="text-sm text-slate-600 mt-1">
                Upload customer list from CSV
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg">
              Upload
            </button>
          </div>
        </AppCard>
      </div>
    </section>
  );
}

/**
 * CategoryContextualHint
 *
 * Shows contextual hint based on user's category and page
 * Purpose: Guide users with industry-specific best practices
 *
 * Usage:
 * <CategoryContextualHint hint={getTemplatesHint(category)} />
 */
export function CategoryContextualHint({ hint }: { hint?: string }) {
  if (!hint) {
    return null;
  }

  return (
    <AppCard className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">💡</div>
        <div>
          <h4 className="font-bold text-amber-900">Pro Tip</h4>
          <p className="text-sm text-amber-800 mt-1">
            {hint}
          </p>
        </div>
      </div>
    </AppCard>
  );
}
