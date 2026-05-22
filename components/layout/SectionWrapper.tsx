import React from "react";
import cn from "classnames";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function SectionWrapper({
  children,
  className,
  title,
  description
}: SectionWrapperProps) {
  return (
    <section className={cn("space-y-8", className)}>
      {title && (
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">{title}</h2>
          {description && (
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
