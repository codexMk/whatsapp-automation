import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "classnames";

type ButtonVariant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white hover:scale-105 hover:shadow-lg px-6 py-3";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md",
  secondary: "border-2 border-blue-300 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-semibold",
  ghost: "text-slate-600 hover:bg-slate-100"
};

export function Button({ variant = "primary", className, children, ...props }: Props) {
  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}

