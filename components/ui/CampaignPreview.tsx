'use client';

import { useState } from 'react';
import { AppCard } from './AppCard';

interface CampaignPreviewProps {
  templateName: string;
  templateContent: string;
  recipientCount: number;
}

export function CampaignPreview({
  templateName,
  templateContent,
  recipientCount,
}: CampaignPreviewProps) {
  return (
    <AppCard className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">📋 Campaign Preview</h3>
        <p className="text-sm text-slate-600">Review your message before sending</p>
      </div>

      <div className="space-y-6">
        {/* Template Info */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Template</p>
          <p className="text-sm font-semibold text-slate-900">{templateName}</p>
        </div>

        {/* Message Preview */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Message Preview</p>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-sm text-slate-800 whitespace-pre-wrap font-medium">
                {templateContent}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-right">
              Mock WhatsApp message preview
            </p>
          </div>
        </div>

        {/* Recipient Count */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Sending To
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {recipientCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {recipientCount === 1 ? 'recipient' : 'recipients'}
              </p>
            </div>
            <div className="text-5xl">👥</div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-900 font-medium">
            ⚠️ Please review carefully. Messages will be sent to all selected customers.
          </p>
        </div>
      </div>
    </AppCard>
  );
}
