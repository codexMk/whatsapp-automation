import React from "react";
import cn from "classnames";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function AppCard({ children, className, hover = true }: AppCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all-smooth",
        hover && "hover:shadow-md hover:border-blue-300",
        className
      )}
    >
      {children}
    </div>
  );
}
