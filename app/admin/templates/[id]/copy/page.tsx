'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';

interface ReadyMadeTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
}

export default function CopyTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState<ReadyMadeTemplate | null>(null);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (!templateId) return;
        const response = await fetch(`/api/templates/ready-made/${templateId}`);
        if (!response.ok) throw new Error('Failed to fetch template');
        const data = await response.json();
        setTemplate(data);
        setTemplateName(`${data.title} (Ready-Made Copy)`);
      } catch (err) {
        console.error('[FETCH-READY-MADE]:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleCopy = async () => {
    if (!template) return;

    try {
      setCopying(true);
      setError('');

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          category: template.category,
          content: template.content,
          isReady: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to copy template');
      }

      router.push('/admin/templates');
    } catch (err) {
      console.error('[COPY-TEMPLATE]:', err);
      setError(err instanceof Error ? err.message : 'Failed to copy template');
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <div className="text-gray-400 text-5xl mb-4">⏳</div>
          <p className="text-gray-500 font-medium">Loading template...</p>
        </div>
      </PageContainer>
    );
  }

  if (!template) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <div className="text-gray-400 text-5xl mb-4">🚫</div>
          <p className="text-gray-500 font-medium">Template not found</p>
          <button
            onClick={() => router.push('/admin/templates')}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
          >
            Back to Templates
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Navigation Header */}
      <div className="mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">📋 Copy Ready-Made Template</h1>
            <p className="text-slate-300 text-sm">Add this professional template to your library</p>
          </div>
          <button
            onClick={() => router.push('/admin/templates')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            ← Back to Templates
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Template Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg capitalize">
                    {template.category.replace('_', ' ')}
                  </span>
                  {template.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-block px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Preview */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">📋 Template Content</label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed font-mono whitespace-pre-wrap text-xs">
                    {template.content}
                  </p>
                </div>
              </div>

              {/* Rename Input */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">✏️ Template Name (Optional)</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter a name for your copy..."
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => router.push('/admin/templates')}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopy}
                  disabled={copying}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {copying ? '🔄 Copying...' : '✅ Copy to My Templates'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ℹ️ About</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-bold mb-2">ORIGINAL TEMPLATE</p>
                <p className="text-sm font-bold text-gray-900">{template.title}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-bold mb-2">CATEGORY</p>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg capitalize">
                  {template.category.replace('_', ' ')}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-bold mb-2">YOUR COPY NAME</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-2">{templateName}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 leading-relaxed">
                  📌 This copy will be added to your custom templates library. You can edit it anytime after creation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
