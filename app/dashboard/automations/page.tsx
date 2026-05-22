"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { AppCard } from "@/components/ui/AppCard";
import { getAutomationPresets, getAutomationsHint } from "@/lib/category-config";
import { useCategoryOrNull } from "@/lib/category-hooks";

export default function AutomationsPage() {
  const category = useCategoryOrNull();
  const presets = getAutomationPresets(category);
  const hint = getAutomationsHint(category);

  return (
    <PageContainer>
      <PageHeader
        title="Automations"
        description="Enable automated workflows for better customer engagement."
      />

      <div className="space-y-4">
        {presets.map((preset) => (
          <AppCard key={preset.key}>
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-4xl">{preset.icon}</div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">{preset.name}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{preset.description}</p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer mt-1">
                <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                <div className="relative w-12 h-7 bg-gradient-to-br from-blue-700 to-blue-600 peer-checked:bg-blue-600 rounded-full peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:border after:border-blue-300 after:transition-all"></div>
              </label>
            </div>
          </AppCard>
        ))}
      </div>

      <AppCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">Pro Tip</h3>
            <p className="mt-2 text-slate-700 text-sm leading-relaxed">
              {hint || "Enable automations to engage customers automatically based on their actions. This saves time and increases customer satisfaction."}
            </p>
          </div>
        </div>
      </AppCard>
    </PageContainer>
  );
}

