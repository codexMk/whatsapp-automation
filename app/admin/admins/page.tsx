'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppCard } from '@/components/ui/AppCard';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/InputField';
import { AdminPermission, getPermissionLabel } from '@/lib/auth/permissions-util';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  permissions: string[];
  status: 'ACTIVE' | 'SUSPENDED';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  permissions: string[];
}

const ALL_PERMISSIONS = Object.values(AdminPermission);

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    permissions: [],
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/admins');
      if (!response.ok) throw new Error('Failed to fetch admins');

      const data = await response.json();
      setAdmins(data.admins || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { adminId: editingId, ...formData }
        : formData;

      const response = await fetch('/api/admin/admins', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save admin');

      await fetchAdmins();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
        permissions: [],
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save admin');
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      permissions: admin.permissions,
    });
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) throw new Error('Failed to delete admin');

      await fetchAdmins();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin');
    }
  };

  const handleToggleActive = async (adminId: string, currentStatus: boolean) => {
    const actionText = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${actionText} this admin?`)) return;

    try {
      const response = await fetch(`/api/admin/admins/${adminId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Failed to ${actionText} admin`);

      await fetchAdmins();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${actionText} admin`);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Admin Management" description="Loading..." />
        <AppCard>
          <div className="text-center py-8">Loading admin accounts...</div>
        </AppCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="👨‍💼 Admin Management"
        description="Create and manage admin accounts and permissions"
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Create Admin Button */}
      <div className="mb-6">
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              email: '',
              password: '',
              role: 'ADMIN',
              permissions: [],
            });
            setShowForm(!showForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {showForm ? '✕ Cancel' : '+ Create New Admin'}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <AppCard className="mb-8 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {editingId ? 'Edit Admin' : 'Create New Admin'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Name"
                name="name"
                type="text"
                placeholder="Admin name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {!editingId && (
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            )}

            {editingId && (
              <InputField
                label="Password (Leave empty to keep current)"
                name="password"
                type="password"
                placeholder="Leave empty to keep current password"
                value={formData.password}
                onChange={handleInputChange}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_PERMISSIONS.map((permission) => (
                  <label key={permission} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{getPermissionLabel(permission as AdminPermission)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Update Admin' : 'Create Admin'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          </form>
        </AppCard>
      )}

      {/* Admins List Table */}
      <AppCard>
        <h3 className="text-xl font-bold text-slate-900 mb-6">Admin Accounts</h3>

        {admins.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>No admin accounts yet. Create your first admin account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Active</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Last Login</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{admin.name || '-'}</td>
                    <td className="py-3 px-4">{admin.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          admin.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          admin.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {admin.isActive ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(admin.id, admin.isActive)}
                          className={`font-semibold text-sm ${
                            admin.isActive
                              ? 'text-amber-600 hover:text-amber-800'
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AppCard>
    </PageContainer>
  );
}
