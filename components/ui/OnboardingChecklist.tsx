'use client';

import { useRouter } from 'next/navigation';
import { AppCard } from './AppCard';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  completed: boolean;
  actionLabel: string;
  actionPath: string;
}

interface OnboardingChecklistProps {
  items: ChecklistItem[];
  onItemClick?: (itemId: string) => void;
}

export function OnboardingChecklist({ items, onItemClick }: OnboardingChecklistProps) {
  const router = useRouter();
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const handleNavigate = (path: string, itemId: string) => {
    onItemClick?.(itemId);
    router.push(path);
  };

  return (
    <AppCard className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">🚀 Get Started Checklist</h2>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-600">
              {completedCount} of {totalCount} completed
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
              item.completed
                ? 'bg-green-50 border border-green-200'
                : 'bg-white border border-slate-200 hover:border-amber-300'
            }`}
          >
            {/* Checkbox */}
            <div className="flex-shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  item.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {item.completed ? '✓' : index + 1}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{item.icon}</span>
                <p className={`font-semibold ${item.completed ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                  {item.label}
                </p>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>

            {/* Action Button */}
            {!item.completed && (
              <button
                onClick={() => handleNavigate(item.actionPath, item.id)}
                className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {item.actionLabel}
              </button>
            )}

            {item.completed && (
              <div className="flex-shrink-0 text-green-600 font-bold">Done ✓</div>
            )}
          </div>
        ))}
      </div>

      {completedCount === totalCount && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700 font-semibold">
            🎉 Congratulations! You've completed all onboarding steps.
          </p>
          <p className="text-sm text-green-600 mt-1">
            You're all set to start automating your WhatsApp messages!
          </p>
        </div>
      )}
    </AppCard>
  );
}
