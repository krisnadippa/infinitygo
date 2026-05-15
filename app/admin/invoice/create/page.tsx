import { Suspense } from "react";
import InvoiceForm from "./form-client";

export default async function CreateInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const editId = id || null;

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 italic">Memuat formulir invoice...</div>}>
      <InvoiceForm editId={editId} />
    </Suspense>
  );
}
