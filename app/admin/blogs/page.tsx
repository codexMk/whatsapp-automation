'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/InputField';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  content: string;
  image: string;
  published: boolean;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image: '',
    published: false,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');

      const data = await response.json();
      // Handle both direct array and nested response
      const blogsList = Array.isArray(data) ? data : (data?.blogs || data?.data || []);
      setBlogs(Array.isArray(blogsList) ? blogsList : []);
      setError('');
    } catch (err) {
      console.error('[BLOGS] Error fetching blogs:', err);
      setBlogs([]);
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
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
      const response = await fetch('/api/admin/blogs', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingId
            ? { ...formData, id: editingId }
            : formData
        ),
      });

      if (!response.ok) throw new Error('Failed to save blog post');

      fetchBlogs();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        image: '',
        published: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image || '',
      published: blog.published,
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete blog post');
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post');
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      const response = await fetch('/api/admin/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blog,
          published: !blog.published,
        }),
      });

      if (!response.ok) throw new Error('Failed to update blog post');
      fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog post');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Blog Management"
        description="Create, edit, and publish blog posts"
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
                image: '',
                published: false,
              });
              setShowForm(!showForm);
            }
          }}
        >
          {showForm && !editingId ? 'Cancel' : 'Create New Post'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Blog post title"
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
                placeholder="Write your blog post content here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                required
              />
            </div>

            <InputField
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                Publish this post
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Update Post' : 'Create Post'}
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
        <div className="text-center py-8 text-gray-500">Loading blog posts...</div>
      ) : (
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
              No blog posts found
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {blog.content.substring(0, 150)}...
                    </p>
                    <div className="text-xs text-gray-500">
                      <span>Slug: {blog.slug}</span>
                      <span className="mx-2">•</span>
                      <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {blog.image && (
                    <div className="ml-4 flex-shrink-0">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className={`px-3 py-2 text-sm font-medium rounded ${
                      blog.published
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {blog.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
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
