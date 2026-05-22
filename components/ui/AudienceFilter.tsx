'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AppCard } from './AppCard';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  tags: string[];
  createdAt: Date;
}

interface AudienceFilterProps {
  customers: Customer[];
  selectedCustomerIds: string[];
  onSelectionChange: (customerIds: string[]) => void;
}

type FilterMode = 'all' | 'by-tag' | 'recent';

export function AudienceFilter({
  customers,
  selectedCustomerIds,
  onSelectionChange,
}: AudienceFilterProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    customers.forEach((customer) => {
      customer.tags?.forEach((tag) => {
        tags.add(tag);
      });
    });
    return Array.from(tags).sort();
  }, [customers]);

  // Filter customers based on mode
  const filteredCustomers = useMemo(() => {
    if (filterMode === 'all') {
      return customers;
    } else if (filterMode === 'by-tag' && selectedTag) {
      return customers.filter((c) => c.tags?.includes(selectedTag));
    } else if (filterMode === 'recent') {
      // Last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return customers.filter((c) => new Date(c.createdAt) >= thirtyDaysAgo);
    }
    return customers;
  }, [filterMode, selectedTag, customers]);

  const handleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      // If all filtered customers are selected, deselect all
      onSelectionChange(
        selectedCustomerIds.filter(
          (id) => !filteredCustomers.map((c) => c.id).includes(id)
        )
      );
    } else {
      // Select all filtered customers
      const newSelectedIds = new Set(selectedCustomerIds);
      filteredCustomers.forEach((c) => newSelectedIds.add(c.id));
      onSelectionChange(Array.from(newSelectedIds));
    }
  };

  const handleToggleCustomer = (customerId: string) => {
    const newSelected = selectedCustomerIds.includes(customerId)
      ? selectedCustomerIds.filter((id) => id !== customerId)
      : [...selectedCustomerIds, customerId];
    onSelectionChange(newSelected);
  };

  const allFiltered = filteredCustomers.every((c) =>
    selectedCustomerIds.includes(c.id)
  );
  const someFiltered = filteredCustomers.some((c) =>
    selectedCustomerIds.includes(c.id)
  );

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someFiltered && !allFiltered;
    }
  }, [allFiltered, someFiltered]);

  return (
    <AppCard className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">👥 Select Audience</h3>
        <p className="text-sm text-slate-600">
          Choose how you want to target your customers
        </p>
      </div>

      {/* Filter Mode Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={() => {
            setFilterMode('all');
            setSelectedTag('');
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterMode === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300'
          }`}
        >
          All Customers
          <span className="ml-2 text-xs opacity-75">({customers.length})</span>
        </button>

        {allTags.length > 0 && (
          <button
            onClick={() => setFilterMode('by-tag')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filterMode === 'by-tag'
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300'
            }`}
          >
            Filter by Tag
          </button>
        )}

        <button
          onClick={() => setFilterMode('recent')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterMode === 'recent'
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-purple-300'
          }`}
        >
          Recently Added (30d)
        </button>
      </div>

      {/* Tag Selector */}
      {filterMode === 'by-tag' && allTags.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
            Choose Tag
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-600">No customers match this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select All */}
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-300 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer font-bold">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allFiltered}
              onChange={handleSelectAll}
              className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span className="text-slate-900">
              Select All ({filteredCustomers.length})
            </span>
          </label>

          {/* Customer Items */}
          <div className="space-y-2 max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-white">
            {filteredCustomers.map((customer) => (
              <label
                key={customer.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCustomerIds.includes(customer.id)}
                  onChange={() => handleToggleCustomer(customer.id)}
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">{customer.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{customer.phone}</div>
                  {customer.tags && customer.tags.length > 0 && (
                    <div className="text-xs text-slate-600 mt-1">
                      {customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full mr-1 text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Total Selected:</p>
          <p className="text-2xl font-black text-purple-600">{selectedCustomerIds.length}</p>
        </div>
      </div>
    </AppCard>
  );
}
