import React from "react";
import cn from "classnames";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}
