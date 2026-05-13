"use client";

import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-sm",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent",
  outline: "bg-white text-slate-700 hover:bg-slate-50 border-slate-300",
  danger: "bg-red-500 text-white hover:bg-red-600 border-transparent shadow-sm",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-[12.5px] gap-1.5",
  md: "px-4 py-2 text-[13.5px] gap-2",
  lg: "px-5 py-2.5 text-[14px] gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg border transition-colors
        ${variantStyles[variant]} ${sizeStyles[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
