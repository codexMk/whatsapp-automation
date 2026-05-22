import React from "react";
import cn from "classnames";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  helperText?: string;
}

export function Label({ required, helperText, children, className, ...props }: LabelProps) {
  return (
    <div className="space-y-1">
      <label className={cn("block text-sm font-bold text-slate-900", className)} {...props}>
        {children}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
