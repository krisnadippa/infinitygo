import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ExpenseClient from "./page-client";

export const dynamic = "force-dynamic";

export default async function ExpensePage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      expenses: true,
    }
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpenseClient initialInvoices={invoices} />
    </Suspense>
  );
}
