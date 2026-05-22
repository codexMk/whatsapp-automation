'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputField } from '@/components/ui/InputField';
import { AppCard } from '@/components/ui/AppCard';
import { CampaignPreview } from '@/components/ui/CampaignPreview';
import { AudienceFilter } from '@/components/ui/AudienceFilter';
import { SchedulingOptions } from '@/components/ui/SchedulingOptions';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  tags: string[];
  createdAt: Date;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

interface CampaignCreatorProps {
  customers: Customer[];
  templates: Template[];
}

type Step = 'info' | 'audience' | 'template' | 'schedule' | 'review';

const STEPS: Step[] = ['info', 'audience', 'template', 'schedule', 'review'];

export function CampaignCreatorFlow({
  customers,
  templates,
}: CampaignCreatorProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Form state
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const selectedCustomers = customers.filter((c) =>
    selectedCustomerIds.includes(c.id)
  );

  const scheduledDateTime = scheduledDate
    ? new Date(scheduledDate + 'T' + scheduledTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // Step progression
  const canProceedFromInfo = campaignName.trim().length > 0 && selectedTemplateId;
  const canProceedFromAudience = selectedCustomerIds.length > 0;
  const canProceedFromTemplate = !!selectedTemplate;
  const canProceedFromSchedule = scheduleMode === 'immediate' || (scheduledDate && scheduledTime);

  const currentStepIndex = STEPS.indexOf(currentStep);

  const handleNext = (step: Step) => {
    const stepIndex = STEPS.indexOf(step);
    if (stepIndex === 1 && !canProceedFromInfo) return;
    if (stepIndex === 2 && !canProceedFromAudience) return;
    if (stepIndex === 3 && !canProceedFromTemplate) return;
    if (stepIndex === 4 && !canProceedFromSchedule) return;
    setCurrentStep(step);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', campaignName);
      formData.append('description', description);
      formData.append('templateId', selectedTemplateId);
      selectedCustomerIds.forEach((id) => formData.append('customerIds', id));
      formData.append('scheduleMode', scheduleMode);
      if (scheduleMode === 'scheduled') {
        formData.append('scheduledDate', scheduledDate);
        formData.append('scheduledTime', scheduledTime);
      }

      const response = await fetch('/api/campaigns/create-advanced', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const result = await response.json();
      router.push(`/dashboard/campaigns/${result.id}`);
    } catch (error) {
      console.error('Campaign creation error:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 justify-center mb-8">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (STEPS.indexOf(step) <= currentStepIndex) {
                  setCurrentStep(step);
                }
              }}
              disabled={STEPS.indexOf(step) > currentStepIndex}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep === step
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                  : STEPS.indexOf(step) < currentStepIndex
                  ? 'bg-green-600 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-600 cursor-not-allowed'
              }`}
            >
              {index + 1}
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`h-1 w-8 ${
                  STEPS.indexOf(step) < currentStepIndex
                    ? 'bg-green-600'
                    : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Info */}
      {currentStep === 'info' && (
        <AppCard>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">📝 Campaign Details</h2>
            <p className="text-slate-600 mt-1">Start by naming your campaign and choosing a template</p>
          </div>

          <div className="space-y-6">
            <InputField
              label="Campaign Name"
              name="name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Diwali Special Offer"
              required
              helperText="Give your campaign a clear, descriptive name"
            />

            <InputField
              label="Description (Optional)"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Internal note about this campaign"
              helperText="Helps you remember what this campaign is about"
            />

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-900">Select Template *</label>
              {templates.length === 0 ? (
                <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-900 font-medium">
                    You don't have any templates yet.{' '}
                    <a href="/dashboard/templates/new" className="font-bold underline">
                      Create one first
                    </a>
                  </p>
                </div>
              ) : (
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  required
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href="/dashboard/campaigns"
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </a>
            <button
              onClick={() => handleNext('audience')}
              disabled={!canProceedFromInfo}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Choose Audience →
            </button>
          </div>
        </AppCard>
      )}

      {/* Step 2: Audience Selection */}
      {currentStep === 'audience' && (
        <>
          <AudienceFilter
            customers={customers}
            selectedCustomerIds={selectedCustomerIds}
            onSelectionChange={setSelectedCustomerIds}
          />

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => handleNext('template')}
              disabled={!canProceedFromAudience}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Review Template →
            </button>
          </div>
        </>
      )}

      {/* Step 3: Template Review */}
      {currentStep === 'template' && selectedTemplate && (
        <>
          <CampaignPreview
            templateName={selectedTemplate.name}
            templateContent={selectedTemplate.content}
            recipientCount={selectedCustomerIds.length}
          />

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => handleNext('schedule')}
              disabled={!canProceedFromTemplate}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Schedule →
            </button>
          </div>
        </>
      )}

      {/* Step 4: Scheduling */}
      {currentStep === 'schedule' && (
        <>
          <SchedulingOptions
            onScheduleChange={(schedule) => {
              setScheduleMode(schedule.mode);
              if (schedule.scheduledDate) setScheduledDate(schedule.scheduledDate);
              if (schedule.scheduledTime) setScheduledTime(schedule.scheduledTime);
            }}
          />

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => handleNext('review')}
              disabled={!canProceedFromSchedule}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Review & Send →
            </button>
          </div>
        </>
      )}

      {/* Step 5: Final Review */}
      {currentStep === 'review' && selectedTemplate && (
        <>
          <AppCard className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">✓ Review Everything</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Campaign
                </p>
                <p className="text-lg font-black text-slate-900">{campaignName}</p>
                {description && (
                  <p className="text-sm text-slate-600 mt-2">{description}</p>
                )}
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Recipients
                </p>
                <p className="text-lg font-black text-blue-600">{selectedCustomerIds.length}</p>
                <p className="text-sm text-slate-600 mt-1">customers selected</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Template
                </p>
                <p className="text-lg font-black text-slate-900">
                  {selectedTemplate.name}
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Schedule
                </p>
                <p className="text-lg font-black text-green-600">
                  {scheduleMode === 'immediate' ? 'Now' : scheduledDateTime}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900 font-bold">
                ⚠️ This action will send <strong>{selectedCustomerIds.length}</strong> WhatsApp{' '}
                {selectedCustomerIds.length === 1 ? 'message' : 'messages'} and cannot be undone.
              </p>
            </div>
          </AppCard>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Send Campaign 🚀
            </button>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        campaignName={campaignName}
        templateName={selectedTemplate?.name || ''}
        templateContent={selectedTemplate?.content || ''}
        recipientCount={selectedCustomerIds.length}
        scheduleMode={scheduleMode}
        scheduledDateTime={scheduledDateTime}
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmation(false)}
        isLoading={isLoading}
      />
    </div>
  );
}
