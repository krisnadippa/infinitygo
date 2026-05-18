import { prisma } from "@/lib/prisma";
import ReportsClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { invoiceDate: "desc" },
    include: { items: true, expenses: true }
  });

  return <ReportsClient initialInvoices={invoices} />;
}
