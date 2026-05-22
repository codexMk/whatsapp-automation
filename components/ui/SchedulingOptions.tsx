'use client';

import { useState } from 'react';
import { AppCard } from './AppCard';

interface SchedulingOptionsProps {
  onScheduleChange: (schedule: {
    mode: 'immediate' | 'scheduled';
    scheduledDate?: string;
    scheduledTime?: string;
  }) => void;
}

export function SchedulingOptions({ onScheduleChange }: SchedulingOptionsProps) {
  const [mode, setMode] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  const handleModeChange = (newMode: 'immediate' | 'scheduled') => {
    setMode(newMode);
    onScheduleChange({
      mode: newMode,
      scheduledDate: newMode === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: newMode === 'scheduled' ? scheduledTime : undefined,
    });
  };

  const handleDateChange = (newDate: string) => {
    setScheduledDate(newDate);
    onScheduleChange({
      mode,
      scheduledDate: newDate,
      scheduledTime,
    });
  };

  const handleTimeChange = (newTime: string) => {
    setScheduledTime(newTime);
    onScheduleChange({
      mode,
      scheduledDate,
      scheduledTime: newTime,
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <AppCard className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">⏰ Schedule Campaign</h3>
        <p className="text-sm text-slate-600">
          Choose when to send your messages
        </p>
      </div>

      <div className="space-y-4">
        {/* Immediate Option */}
        <label className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all" 
          style={{
            borderColor: mode === 'immediate' ? '#16a34a' : '#e2e8f0',
            backgroundColor: mode === 'immediate' ? '#f0fdf4' : '#ffffff',
          }}>
          <input
            type="radio"
            name="schedule-mode"
            value="immediate"
            checked={mode === 'immediate'}
            onChange={() => handleModeChange('immediate')}
            className="h-5 w-5 cursor-pointer accent-green-600"
          />
          <div>
            <p className="font-bold text-slate-900">Send Immediately</p>
            <p className="text-sm text-slate-600">Messages will be sent right now</p>
          </div>
        </label>

        {/* Scheduled Option */}
        <label className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all"
          style={{
            borderColor: mode === 'scheduled' ? '#16a34a' : '#e2e8f0',
            backgroundColor: mode === 'scheduled' ? '#f0fdf4' : '#ffffff',
          }}>
          <input
            type="radio"
            name="schedule-mode"
            value="scheduled"
            checked={mode === 'scheduled'}
            onChange={() => handleModeChange('scheduled')}
            className="h-5 w-5 cursor-pointer accent-green-600"
          />
          <div className="flex-1">
            <p className="font-bold text-slate-900">Schedule for Later</p>
            <p className="text-sm text-slate-600">Choose date and time</p>
          </div>
        </label>

        {/* Date/Time Inputs */}
        {mode === 'scheduled' && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={today}
                required
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                required
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            {scheduledDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-900 font-medium">
                  ✓ Campaign will be sent on{' '}
                  <strong>
                    {new Date(scheduledDate + 'T' + scheduledTime).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </p>
              </div>
            )}
          </div>
        )}

        {mode === 'immediate' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900 font-medium">
              ✓ Campaign will be sent immediately when you confirm
            </p>
          </div>
        )}
      </div>
    </AppCard>
  );
}
