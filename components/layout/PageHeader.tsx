import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex-1">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-slate-600 max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
