'use client';

import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/InputField';

interface User {
  id: string;
  email: string;
  businessName: string;
  role: string;
  status: string;
  planId: string | null;
  createdAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isBusinessVerified: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(verificationFilter !== 'all' && { verification: verificationFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.users || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, verificationFilter]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleSuspendUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          status: 'SUSPENDED',
        }),
      });

      if (!response.ok) throw new Error('Failed to suspend user');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend user');
    } finally {
      setActionLoading('');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          status: 'ACTIVE',
        }),
      });

      if (!response.ok) throw new Error('Failed to activate user');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user');
    } finally {
      setActionLoading('');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setActionLoading(userId);
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        description="Manage platform users, view activity, and control access"
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <InputField
          label="Search Users"
          placeholder="Search by email or business name..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Verification Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => {
            setVerificationFilter('all');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            verificationFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => {
            setVerificationFilter('verified');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            verificationFilter === 'verified'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✅ Verified
        </button>
        <button
          onClick={() => {
            setVerificationFilter('unverified');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            verificationFilter === 'unverified'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⏳ Unverified
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Verification Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isFullyVerified = user.emailVerified && user.phoneVerified && user.isBusinessVerified;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.businessName || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2 items-center">
                          {isFullyVerified ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              ✅ Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                              ⏳ Pending
                            </span>
                          )}
                          <div className="text-xs text-gray-600 space-x-1">
                            <span className={user.emailVerified ? 'text-green-600' : 'text-red-600'}>
                              {user.emailVerified ? '✓' : '✗'} Email
                            </span>
                            <span className={user.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                              {user.phoneVerified ? '✓' : '✗'} Phone
                            </span>
                            <span className={user.isBusinessVerified ? 'text-green-600' : 'text-red-600'}>
                              {user.isBusinessVerified ? '✓' : '✗'} Business
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {actionLoading === user.id ? 'Suspending...' : 'Suspend'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            {actionLoading === user.id ? 'Activating...' : 'Activate'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {actionLoading === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {users.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page {page}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={users.length < 10}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
