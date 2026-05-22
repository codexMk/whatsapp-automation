'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { InputField } from '@/components/ui/InputField';

const categories = ['clinic', 'shop', 'real_estate', 'coaching', 'csc'];

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  isReady: boolean;
  userId: string;
}

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Template | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        if (!templateId) return;
        const response = await fetch(`/api/templates/${templateId}`);
        if (!response.ok) throw new Error('Failed to fetch template');
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        console.error('[FETCH-TEMPLATE]:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    if (!formData.name.trim()) {
      setError('Template name is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Template content is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      router.push('/admin/templates');
    } catch (err) {
      console.error('[UPDATE-TEMPLATE]:', err);
      setError(err instanceof Error ? err.message : 'Failed to update template');
    } finally {
      setSaving(false);
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

  if (!formData) {
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
            <h1 className="text-3xl font-bold text-white mb-1">✏️ Edit Template</h1>
            <p className="text-slate-300 text-sm">Update your template details and content</p>
          </div>
          <button
            onClick={() => router.push('/admin/templates')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            ← Back to Templates
          </button>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Template Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  📝 Template Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Appointment Reminder"
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  📁 Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Content */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  ✍️ Template Content
                </label>
                <p className="text-xs text-gray-600 mb-2">Use double curly braces for dynamic placeholders</p>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="e.g., Hello with name placeholder, your appointment is on date placeholder at time placeholder"
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isReady"
                  checked={formData.isReady}
                  onChange={(e) => setFormData({ ...formData, isReady: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isReady" className="text-sm font-bold text-gray-900 cursor-pointer">
                  ✅ Mark as Ready to Use
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin/templates')}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? '🔄 Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Preview</h3>

            <div className="space-y-4">
              {/* Name Preview */}
              <div>
                <p className="text-xs text-gray-600 font-bold mb-2">TEMPLATE NAME</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-bold text-blue-900">{formData.name}</p>
                </div>
              </div>

              {/* Category Preview */}
              <div>
                <p className="text-xs text-gray-600 font-bold mb-2">CATEGORY</p>
                <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg capitalize">
                  {formData.category.replace('_', ' ')}
                </div>
              </div>

              {/* Content Preview */}
              <div>
                <p className="text-xs text-gray-600 font-bold mb-2">CONTENT PREVIEW</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-6 font-mono whitespace-pre-wrap">
                    {formData.content}
                  </p>
                </div>
              </div>

              {/* Status Preview */}
              <div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                  <span className="text-lg">{formData.isReady ? '✅' : '✎'}</span>
                  <span className="text-sm font-bold text-blue-900">
                    {formData.isReady ? 'Ready to Use' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
