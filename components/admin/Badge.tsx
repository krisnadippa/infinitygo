import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "blue" | "green" | "red" | "yellow" | "slate" | "purple";
}

const variantStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-600 border-red-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function Badge({ children, variant = "slate" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-medium border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "green" | "yellow" | "blue" | "red" | "slate" | "purple"> = {
    Paid: "green",
    Pending: "yellow",
    DP: "blue",
    Draft: "slate",
    Cancelled: "red",
    Active: "green",
    Inactive: "red",
  };
  const labels: Record<string, string> = {
    DP: "DP",
  };
  return <Badge variant={map[status] ?? "slate"}>{labels[status] ?? status}</Badge>;
}
