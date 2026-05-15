import { prisma } from "@/lib/prisma";
import InvoiceDetailClient from "./page-client";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      items: true,
      expenses: true,
    }
  });

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailClient initialData={invoice} />;
}
