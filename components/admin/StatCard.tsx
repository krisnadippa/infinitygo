import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full ${
              isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-[12.5px] text-slate-500 font-medium mb-1">{title}</p>
      <p 
        className="text-[16px] sm:text-[18px] xl:text-[19px] 2xl:text-[22px] font-bold text-slate-800 leading-tight tracking-tight truncate" 
        title={value}
      >
        {value}
      </p>
      {changeLabel && (
        <p className="text-[11.5px] text-slate-400 mt-1.5">{changeLabel}</p>
      )}
    </div>
  );
}
