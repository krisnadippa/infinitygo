import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDate } from "@/lib/admin-data";
import { Users, Search } from "lucide-react";

export const metadata = {
  title: "Customer | BaliTravel Admin",
};

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
  const avgSpent = customers.length > 0 ? Math.round(totalSpent / customers.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[20px] font-bold text-slate-800">Customer</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">{customers.length} customer terdaftar</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customer", value: customers.length, color: "text-blue-600" },
          { label: "Total Orders", value: totalOrders, color: "text-green-600" },
          { label: "Total Revenue", value: formatRupiah(totalSpent), color: "text-purple-600" },
          { label: "Avg per Customer", value: formatRupiah(avgSpent), color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <p className="text-[12px] text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-[18px] font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-[14.5px] font-semibold text-slate-800">Daftar Customer</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Customer", "Kontak", "Total Order", "Total Spent", "Last Order"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-[13px] flex-shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <p className="text-[13px] font-medium text-slate-700">{cust.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] text-slate-600">{cust.phone}</p>
                    <p className="text-[11.5px] text-slate-400">{cust.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-semibold text-slate-800">{cust.totalOrders}</span>
                    <span className="text-[11.5px] text-slate-400 ml-1">orders</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-green-600">{formatRupiah(cust.totalSpent)}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600">{formatDate(cust.lastOrder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
