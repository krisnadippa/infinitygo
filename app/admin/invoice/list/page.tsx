import { prisma } from "@/lib/prisma";
import InvoiceListClient from "./page-client";

export default async function InvoiceListPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      expenses: true,
    }
  });

  return <InvoiceListClient initialData={invoices} />;
}
