'use client';

import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { InputField } from '@/components/ui/InputField';
import { AppCard } from '@/components/ui/AppCard';

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  imageUrl: string | null;
  isReady: boolean;
  userId: string;
}

interface ReadyMadeTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
}

interface AdminTemplateStats {
  templates: ReadyMadeTemplate[];
  count: number;
  categoryBreakdown: Array<{ category: string; count: number }>;
  stats?: {
    totalTemplates: number;
    totalCopies: number;
  };
}

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [readyMadeTemplates, setReadyMadeTemplates] = useState<ReadyMadeTemplate[]>([]);
  const [statsData, setStatsData] = useState<AdminTemplateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [readyMadeLoading, setReadyMadeLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'ready-made' | 'user-templates'>('ready-made');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = [
    'clinic',
    'shop',
    'real_estate',
    'coaching',
    'csc',
  ];

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      console.error('[DELETE-TEMPLATE]:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/admin/templates/${templateId}/edit`);
  };

  const handleAddTemplate = () => {
    router.push('/admin/templates/new');
  };

  const handleBackToDashboard = () => {
    router.push('/admin');
  };

  const fetchReadyMadeTemplates = useCallback(async () => {
    try {
      setReadyMadeLoading(true);
      const params = new URLSearchParams({
        ...(categoryFilter && { category: categoryFilter }),
        ...(searchTerm && { search: searchTerm }),
        includeStats: 'true',
      });

      const response = await fetch(`/api/admin/templates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch ready-made templates');

      const data = await response.json();
      setReadyMadeTemplates(data.templates || []);
      setStatsData(data);
      setError('');
    } catch (err) {
      console.error('[ADMIN-TEMPLATES] Error fetching ready-made templates:', err);
      setReadyMadeTemplates([]);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setReadyMadeLoading(false);
    }
  }, [categoryFilter, searchTerm]);

  const fetchUserTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(categoryFilter && { category: categoryFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/templates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch templates');

      const data = await response.json();
      // Handle both direct array and nested response
      const templatesList = Array.isArray(data) ? data : (data?.templates || data?.data || []);
      setTemplates(Array.isArray(templatesList) ? templatesList : []);
      setError('');
    } catch (err) {
      console.error('[TEMPLATES] Error fetching templates:', err);
      setTemplates([]);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, searchTerm]);

  useEffect(() => {
    if (activeTab === 'ready-made') {
      fetchReadyMadeTemplates();
    } else {
      fetchUserTemplates();
    }
  }, [activeTab, fetchReadyMadeTemplates, fetchUserTemplates]);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      {/* Professional Navigation Header Bar */}
      <div className="mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">📋 Template Management</h1>
            <p className="text-slate-300 text-sm">Manage and organize professional templates system-wide</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddTemplate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ➕ Add Template
            </button>
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Card-Based Tab Navigation */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ready-Made Templates Card */}
          <button
            onClick={() => setActiveTab('ready-made')}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'ready-made'
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl'
                : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-purple-300 hover:shadow-lg'
            }`}
          >
            {/* Gradient Overlay for Active State */}
            {activeTab === 'ready-made' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">⚡</div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  activeTab === 'ready-made'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-50 text-purple-600'
                }`}>
                  50 Templates
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                activeTab === 'ready-made' ? 'text-white' : 'text-gray-900'
              }`}>
                Ready-Made Templates
              </h3>
              <p className={`text-sm ${
                activeTab === 'ready-made' ? 'text-purple-100' : 'text-gray-600'
              }`}>
                Browse and use professionally crafted templates across 5 categories
              </p>
              <div className={`mt-4 pt-4 border-t ${
                activeTab === 'ready-made' ? 'border-white/20' : 'border-gray-200'
              } flex items-center text-sm font-semibold ${
                activeTab === 'ready-made' ? 'text-purple-100' : 'text-purple-600'
              }`}>
                {activeTab === 'ready-made' ? '✓ Selected' : 'Click to view'} →
              </div>
            </div>
          </button>

          {/* User Templates Card */}
          <button
            onClick={() => setActiveTab('user-templates')}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'user-templates'
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl'
                : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-purple-300 hover:shadow-lg'
            }`}
          >
            {/* Gradient Overlay for Active State */}
            {activeTab === 'user-templates' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">👤</div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  activeTab === 'user-templates'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-50 text-purple-600'
                }`}>
                  Your Custom
                </div>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                activeTab === 'user-templates' ? 'text-white' : 'text-gray-900'
              }`}>
                User Templates
              </h3>
              <p className={`text-sm ${
                activeTab === 'user-templates' ? 'text-purple-100' : 'text-gray-600'
              }`}>
                Manage and organize your custom created templates
              </p>
              <div className={`mt-4 pt-4 border-t ${
                activeTab === 'user-templates' ? 'border-white/20' : 'border-gray-200'
              } flex items-center text-sm font-semibold ${
                activeTab === 'user-templates' ? 'text-purple-100' : 'text-purple-600'
              }`}>
                {activeTab === 'user-templates' ? '✓ Selected' : 'Click to view'} →
              </div>
            </div>
          </button>
        </div>

      {/* Ready-Made Templates Tab */}
      {activeTab === 'ready-made' && (
        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-sm">
              ⚠️ {error}
            </div>
          )}
          {/* Enhanced Statistics Cards */}
          {statsData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Templates Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Total Templates</p>
                      <p className="text-4xl font-bold text-blue-600">{statsData.count}</p>
                    </div>
                    <div className="text-3xl">📦</div>
                  </div>
                  <p className="text-xs text-gray-500">Across all categories</p>
                </div>
              </div>

              {/* Category Breakdown Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-3">Category Breakdown</p>
                      <div className="space-y-2">
                        {statsData.categoryBreakdown.map((cat) => (
                          <div key={cat.category} className="flex justify-between items-center text-xs">
                            <span className="capitalize text-gray-700 font-medium">{cat.category.replace('_', ' ')}</span>
                            <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{cat.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-3xl">📊</div>
                  </div>
                </div>
              </div>

              {/* Total Copies Card */}
              {statsData.stats && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold mb-2">Total Copies</p>
                        <p className="text-4xl font-bold text-purple-600">{statsData.stats.totalCopies}</p>
                      </div>
                      <div className="text-3xl">📋</div>
                    </div>
                    <p className="text-xs text-gray-500">User copies created</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Filters Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <InputField
                  label="🔍 Search Templates"
                  placeholder="Search by title, description, or keywords..."
                  value={searchTerm}
                  onChange={(e: any) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div className="w-56">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📁 Filter by Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-slate-800 text-white rounded-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          {readyMadeLoading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="text-gray-400 text-5xl mb-4">⏳</div>
                <p className="text-gray-500 font-medium">Loading professional templates...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyMadeTemplates.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-gray-400 text-5xl mb-4">🚫</div>
                  <p className="text-gray-500 font-medium">No templates found matching your filters</p>
                </div>
              ) : (
                readyMadeTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-300 -z-1"></div>

                    <div className="relative p-6">
                      {/* Header with Category Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition mb-1">
                            {template.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                        </div>
                        <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg whitespace-nowrap capitalize">
                          {template.category.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 font-mono text-xs">
                          {template.content}
                        </p>
                      </div>

                      {/* Tags */}
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 hover:border-blue-400 transition"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-500 font-mono">ID: {template.id}</span>
                          <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                            Template
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/admin/templates/${template.id}/copy`)}
                          className="w-full px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          📋 Copy to My Templates
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* User Templates Tab */}
      {activeTab === 'user-templates' && (
        <div className="space-y-8">
          {/* Enhanced Filters Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <InputField
                  label="🔍 Search Templates"
                  placeholder="Search by name or content..."
                  value={searchTerm}
                  onChange={(e: any) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="w-56">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📁 Filter by Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 bg-slate-800 text-white rounded-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="text-gray-400 text-5xl mb-4">⏳</div>
                <p className="text-gray-500 font-medium">Loading your templates...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-gray-400 text-5xl mb-4">📭</div>
                  <p className="text-gray-500 font-medium">You haven't created any templates yet</p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-300 -z-1"></div>

                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition mb-2">
                            {template.name}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg capitalize">
                              {template.category || 'Uncategorized'}
                            </span>
                            <span
                              className={`inline-block px-3 py-1 text-xs font-bold rounded-lg ${
                                template.isReady
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-yellow-50 text-yellow-700'
                              }`}
                            >
                              {template.isReady ? '✓ Ready' : '✎ Draft'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 font-mono text-xs">
                          {template.content.substring(0, 150)}...
                        </p>
                      </div>

                      {/* Footer with Action Buttons */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-500 font-mono">ID: {template.id.substring(0, 8)}</span>
                          <div className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                            Custom
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTemplate(template.id)}
                            className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(template.id)}
                            className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Enhanced Pagination */}
          {filteredTemplates.length > 0 && (
            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-semibold">Page</span>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">{page}</div>
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={filteredTemplates.length < 10}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200">
            <div className="flex items-center justify-center mb-4 h-12 w-12 rounded-full bg-red-100 mx-auto">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Template</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this template? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDeleteTemplate(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? '🔄 Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
