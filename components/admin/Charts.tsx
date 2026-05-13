"use client";

import { monthlyChartData, formatRupiah } from "@/lib/admin-data";

interface BarChartProps {
  data: typeof monthlyChartData;
}

export function RevenueExpenseChart({ data }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.expense)));
  const activeData = data.filter((d) => d.revenue > 0 || d.expense > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[14.5px] font-semibold text-slate-800">Revenue vs Expense</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Perbandingan bulanan tahun 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600" />
            <span className="text-[12px] text-slate-500">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-400" />
            <span className="text-[12px] text-slate-500">Expense</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 h-48 overflow-x-auto">
        {data.map((item, i) => {
          const revHeight = maxVal > 0 ? (item.revenue / maxVal) * 100 : 0;
          const expHeight = maxVal > 0 ? (item.expense / maxVal) * 100 : 0;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[40px] group">
              <div className="flex items-end gap-1 w-full h-40">
                <div
                  className="flex-1 bg-blue-600 rounded-t-md transition-all duration-700 hover:bg-blue-500 relative group"
                  style={{ height: `${revHeight}%`, minHeight: item.revenue > 0 ? "4px" : "0" }}
                  title={`Revenue: ${formatRupiah(item.revenue)}`}
                />
                <div
                  className="flex-1 bg-rose-400 rounded-t-md transition-all duration-700 hover:bg-rose-300 relative"
                  style={{ height: `${expHeight}%`, minHeight: item.expense > 0 ? "4px" : "0" }}
                  title={`Expense: ${formatRupiah(item.expense)}`}
                />
              </div>
              <span className="text-[10.5px] text-slate-400">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MonthlyTargetCard() {
  const target = 150000000;
  const achieved = 125000000;
  const percent = Math.round((achieved / target) * 100);

  // SVG gauge
  const radius = 60;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14.5px] font-semibold text-slate-800">Monthly Target</h3>
          <p className="text-[12px] text-slate-400 mt-0.5">Target bulan Mei 2026</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-2">
        <div className="relative">
          <svg width={160} height={90} viewBox="0 0 160 90">
            {/* Background arc */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#2563eb"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-[24px] font-bold text-slate-800">{percent}%</span>
            <span className="text-[11px] text-green-500 font-medium">+10%</span>
          </div>
        </div>

        <p className="text-[12px] text-slate-500 text-center mt-2">
          Revenue <span className="font-semibold text-slate-700">{formatRupiah(achieved)}</span> dari target {formatRupiah(target)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 border-t border-slate-100 pt-4">
        {[
          { label: "Target", value: formatRupiah(target), trend: "down", color: "text-red-500" },
          { label: "Revenue", value: formatRupiah(achieved), trend: "up", color: "text-green-500" },
          { label: "Profit", value: formatRupiah(52500000), trend: "up", color: "text-green-500" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-[10.5px] text-slate-400 mb-0.5">{item.label}</p>
            <p className={`text-[11.5px] font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
