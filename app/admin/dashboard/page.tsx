import {
  ShoppingCart,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/Badge";
import { RevenueExpenseChart, MonthlyTargetCard } from "@/components/admin/Charts";
import {
  computeDashboardStats,
  formatRupiah,
  formatDate,
} from "@/lib/admin-data";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | BaliTravel Admin",
  description: "Overview statistik bisnis travel Bali",
};

export default async function AdminDashboardPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, expenses: true }
  });
  
  const tourPackages = await prisma.tourPackage.findMany({
    where: { status: "Active" },
    take: 4,
  });

  const stats = computeDashboardStats(invoices as any);
  const recentInvoices = invoices.slice(0, 5);
  const topPackages = tourPackages;

  // Real-time monthly chart data for the current year
  const currentYear = new Date().getFullYear();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyChartData = months.map((month, index) => {
    const monthlyInvoices = invoices.filter((inv) => {
      const date = new Date(inv.invoiceDate);
      return date.getFullYear() === currentYear && date.getMonth() === index;
    });

    const paidInvoices = monthlyInvoices.filter((inv) =>
      ["PAID", "Paid", "Lunas"].includes(inv.status)
    );

    const revenue = paidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const expense = paidInvoices.reduce((sum, inv) => sum + inv.totalExpense, 0);

    return {
      month,
      revenue,
      expense,
    };
  });

  // Calculate current month's stats for the Monthly Target Card
  const currentMonthIndex = new Date().getMonth();
  const currentMonthData = monthlyChartData[currentMonthIndex];
  const currentMonthRevenue = currentMonthData ? currentMonthData.revenue : 0;
  const currentMonthExpense = currentMonthData ? currentMonthData.expense : 0;
  const currentMonthProfit = currentMonthRevenue - currentMonthExpense;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Dashboard</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Selamat datang kembali, Admin InfinityGo
          </p>
        </div>
        <p className="text-[12.5px] text-slate-400 hidden sm:block">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="col-span-2 lg:col-span-1 xl:col-span-1">
          <StatCard
            title="Total Orders"
            value={String(stats.totalOrders)}
            change={12}
            changeLabel="vs bulan lalu"
            icon={<ShoppingCart size={20} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>
        <div className="col-span-2 lg:col-span-1 xl:col-span-1">
          <StatCard
            title="Total Revenue"
            value={formatRupiah(stats.totalRevenue)}
            change={18}
            changeLabel="vs bulan lalu"
            icon={<DollarSign size={20} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
        </div>
        <div className="col-span-2 lg:col-span-1 xl:col-span-1">
          <StatCard
            title="Total Expense"
            value={formatRupiah(stats.totalExpense)}
            change={-5}
            changeLabel="vs bulan lalu"
            icon={<TrendingDown size={20} />}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
        </div>
        <div className="col-span-2 lg:col-span-1 xl:col-span-1">
          <StatCard
            title="Net Profit"
            value={formatRupiah(stats.netProfit)}
            change={24}
            changeLabel="vs bulan lalu"
            icon={<TrendingUp size={20} />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <StatCard
            title="Pending Invoice"
            value={String(stats.pendingInvoices)}
            icon={<Clock size={20} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <StatCard
            title="Paid Invoice"
            value={String(stats.paidInvoices)}
            icon={<CheckCircle size={20} />}
            iconBg="bg-teal-50"
            iconColor="text-teal-600"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueExpenseChart data={monthlyChartData} />
        </div>
        <div className="xl:col-span-1">
          <MonthlyTargetCard achieved={currentMonthRevenue} profit={currentMonthProfit} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-[14.5px] font-semibold text-slate-800">Invoice Terbaru</h3>
            <Link
              href="/admin/invoice/list"
              className="text-[12.5px] text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Invoice
                  </th>
                  <th className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Total
                  </th>
                  <th className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-medium text-blue-600">
                        {inv.invoiceNumber}
                      </span>
                      <p className="text-[11.5px] text-slate-400 mt-0.5">{formatDate(inv.invoiceDate)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-slate-700 font-medium">{inv.customerName}</p>
                      <p className="text-[11.5px] text-slate-400">{inv.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-slate-800">
                        {formatRupiah(inv.grandTotal)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Packages */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-[14.5px] font-semibold text-slate-800">Top Paket Tour</h3>
            <Link
              href="/admin/packages"
              className="text-[12.5px] text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {topPackages.map((pkg, i) => (
              <div key={pkg.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-700 truncate">{pkg.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-slate-400" />
                    <p className="text-[11.5px] text-slate-400 truncate">{pkg.location}</p>
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-slate-800 flex-shrink-0">
                  {formatRupiah(pkg.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
