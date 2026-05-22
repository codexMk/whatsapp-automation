'use client';

import { useState } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  campaignName: string;
  templateName: string;
  templateContent: string;
  recipientCount: number;
  scheduleMode: 'immediate' | 'scheduled';
  scheduledDateTime?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  campaignName,
  templateName,
  templateContent,
  recipientCount,
  scheduleMode,
  scheduledDateTime,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-6 text-white">
          <h2 className="text-2xl font-black mb-2">⚠️ Confirm Campaign</h2>
          <p className="text-orange-100">
            Please review everything carefully before sending
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Campaign Info */}
          <div className="border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Campaign Name
            </p>
            <p className="text-lg font-black text-slate-900">{campaignName}</p>
          </div>

          {/* Message Preview */}
          <div className="border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
              Message Template: {templateName}
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 rounded p-4">
              <p className="text-sm text-slate-800 whitespace-pre-wrap font-medium">
                {templateContent}
              </p>
            </div>
          </div>

          {/* Recipients */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                Recipients
              </p>
              <p className="text-3xl font-black text-blue-600">{recipientCount}</p>
              <p className="text-xs text-slate-600 mt-1">
                {recipientCount === 1 ? 'person' : 'people'}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                Schedule
              </p>
              <p className="text-sm font-bold text-slate-900">
                {scheduleMode === 'immediate' ? (
                  <span className="text-green-600">Right Now</span>
                ) : (
                  <span className="text-green-600">{scheduledDateTime}</span>
                )}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <p className="text-sm text-yellow-900 font-bold">
              🚨 Important: This action cannot be undone. Messages will be sent to all{' '}
              <strong>{recipientCount}</strong> {recipientCount === 1 ? 'recipient' : 'recipients'}.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              id="agree"
              className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer mt-0.5"
              required
            />
            <span className="text-sm text-slate-700">
              I understand this will send <strong>{recipientCount}</strong> WhatsApp{' '}
              {recipientCount === 1 ? 'message' : 'messages'} and confirm I want to proceed
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-6 py-4 flex gap-3 border-t border-slate-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={() => {
              const agreeCheckbox = document.getElementById('agree') as HTMLInputElement;
              if (!agreeCheckbox?.checked) {
                alert('Please confirm the agreement before sending');
                return;
              }
              onConfirm();
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Sending...' : '✓ Send Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}
