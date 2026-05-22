'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/InputField';

interface Plan {
  id: string;
  name: string;
  price: number;
  messageLimit: number;
  automationLimit: number;
  features: string[];
  description: string;
  active: boolean;
  createdAt: string;
}

interface FormData {
  name: string;
  price: string;
  messageLimit: string;
  automationLimit: string;
  features: string;
  description: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    messageLimit: '',
    automationLimit: '',
    features: '',
    description: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');

      const data = await response.json();
      // Handle both direct array and nested response
      const plansList = Array.isArray(data) ? data : (data?.plans || data?.data || []);
      setPlans(Array.isArray(plansList) ? plansList : []);
      setError('');
    } catch (err) {
      console.error('[PLANS] Error fetching plans:', err);
      setPlans([]);
      setError(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        price: parseInt(formData.price),
        messageLimit: parseInt(formData.messageLimit),
        automationLimit: parseInt(formData.automationLimit),
        features: formData.features.split(',').map((f) => f.trim()),
        description: formData.description,
      };

      const response = await fetch('/api/admin/plans', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });

      if (!response.ok) throw new Error('Failed to save plan');

      fetchPlans();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        price: '',
        messageLimit: '',
        automationLimit: '',
        features: '',
        description: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save plan');
    }
  };

  const handleEdit = (plan: Plan) => {
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      messageLimit: plan.messageLimit.toString(),
      automationLimit: plan.automationLimit.toString(),
      features: plan.features.join(', '),
      description: plan.description,
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const response = await fetch('/api/admin/plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete plan');
      fetchPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete plan');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Plan Management"
        description="Create and manage subscription plans"
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
                name: '',
                price: '',
                messageLimit: '',
                automationLimit: '',
                features: '',
                description: '',
              });
              setShowForm(!showForm);
            }
          }}
        >
          {showForm && !editingId ? 'Cancel' : 'Create New Plan'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Plan' : 'Create New Plan'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Starter, Growth, Pro"
              required
            />
            <InputField
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 599"
              required
            />
            <InputField
              label="Message Limit"
              name="messageLimit"
              type="number"
              value={formData.messageLimit}
              onChange={handleInputChange}
              placeholder="e.g., 1000"
              required
            />
            <InputField
              label="Automation Limit"
              name="automationLimit"
              type="number"
              value={formData.automationLimit}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (comma-separated)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., Basic support, Single category, Custom branding"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Plan description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Update Plan' : 'Create Plan'}
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
        <div className="text-center py-8 text-gray-500">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No plans found
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-600 text-sm">/month</span>
                </div>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div>📧 {plan.messageLimit.toLocaleString()} messages</div>
                  <div>⚙️ {plan.automationLimit} automations</div>
                </div>
                {plan.features.length > 0 && (
                  <div className="mb-4 pb-4 border-b">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Features:</div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.description && (
                  <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded font-medium"
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
