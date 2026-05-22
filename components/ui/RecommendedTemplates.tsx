'use client';

import { useRouter } from 'next/navigation';
import { AppCard } from './AppCard';

interface RecommendedTemplate {
  name: string;
  description: string;
  content: string;
  icon: string;
  useCase: string;
}

interface RecommendedTemplatesProps {
  templates: RecommendedTemplate[];
}

export function RecommendedTemplates({ templates }: RecommendedTemplatesProps) {
  const router = useRouter();

  if (!templates || templates.length === 0) {
    return null;
  }

  const handleUseTemplate = (template: RecommendedTemplate) => {
    // Redirect to templates page with pre-filled data
    const params = new URLSearchParams({
      name: template.name,
      content: template.content,
      useCase: template.useCase,
    });
    router.push(`/dashboard/templates/new?${params.toString()}`);
  };

  return (
    <AppCard className="mb-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">💡 Recommended for You</h2>
        <p className="text-slate-600 mt-1">
          Templates tailored to your business category
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.useCase}
            className="flex flex-col p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-400 hover:shadow-md transition-all group"
          >
            {/* Icon and Title */}
            <div className="flex items-start gap-3 mb-2">
              <div className="text-2xl flex-shrink-0">{template.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  {template.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-3 flex-grow">
              {template.description}
            </p>

            {/* Preview */}
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold mb-1">Preview:</p>
              <p className="text-xs text-slate-700 line-clamp-3">
                {template.content}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleUseTemplate(template)}
              className="w-full px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Use Template
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-600">
            Set your business category to see recommended templates
          </p>
        </div>
      )}
    </AppCard>
  );
}
