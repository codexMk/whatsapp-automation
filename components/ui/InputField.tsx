import React from "react";
import cn from "classnames";

interface InputFieldProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  required?: boolean;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & InputFieldProps;

export function InputField({
  label,
  helperText,
  error,
  errorMessage,
  className,
  required,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-slate-900">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-800 text-white placeholder-slate-400 transition-all-smooth focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
