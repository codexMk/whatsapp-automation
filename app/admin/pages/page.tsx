'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/InputField';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  content: string;
  visible: boolean;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    visible: true,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');

      const data = await response.json();
      // Handle both direct array and nested response
      const pagesList = Array.isArray(data) ? data : (data?.pages || data?.data || []);
      setPages(Array.isArray(pagesList) ? pagesList : []);
      setError('');
    } catch (err) {
      console.error('[PAGES] Error fetching pages:', err);
      setPages([]);
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/pages', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingId
            ? { ...formData, id: editingId }
            : formData
        ),
      });

      if (!response.ok) throw new Error('Failed to save page');

      fetchPages();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        visible: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page');
    }
  };

  const handleEdit = (page: Page) => {
    setFormData({
      title: page.title,
      content: page.content,
      visible: page.visible,
    });
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch('/api/admin/pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete page');
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    }
  };

  const handleToggleVisibility = async (page: Page) => {
    try {
      const response = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          visible: !page.visible,
        }),
      });

      if (!response.ok) throw new Error('Failed to update page');
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update page');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Page Management"
        description="Create and manage static pages like About, Privacy Policy, Terms, etc."
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <Button
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false);
            } else {
              setEditingId(null);
              setFormData({
                title: '',
                content: '',
                visible: true,
              });
              setShowForm(!showForm);
            }
          }}
        >
          {showForm && !editingId ? 'Cancel' : 'Create New Page'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Page' : 'Create New Page'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Page Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., About Us, Privacy Policy, Terms & Conditions"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your page content here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="visible"
                name="visible"
                checked={formData.visible}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                Make this page visible
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Update Page' : 'Create Page'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading pages...</div>
      ) : (
        <div className="space-y-4">
          {pages.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
              No pages found
            </div>
          ) : (
            pages.map((page) => (
              <div
                key={page.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          page.visible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {page.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {page.content.substring(0, 200)}...
                    </p>
                    <div className="text-xs text-gray-500">
                      <span>Slug: /{page.slug}</span>
                      <span className="mx-2">•</span>
                      <span>Updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleToggleVisibility(page)}
                    className={`px-3 py-2 text-sm font-medium rounded ${
                      page.visible
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {page.visible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleEdit(page)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </PageContainer>
  );
}
