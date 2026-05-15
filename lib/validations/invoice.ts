import { z } from "zod";

export const InvoiceItemSchema = z.object({
  itemName: z.string().min(1, "Nama item wajib"),
  itemType: z.string().min(1, "Tipe item wajib"),
  quantity: z.number().gt(0, "Jumlah harus lebih dari 0"),
  price: z.number().nonnegative("Harga tidak boleh negatif"),
  subtotal: z.number(),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Nomor invoice wajib"),
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  invoiceDate: z.date().or(z.string().pipe(z.coerce.date())),
  dueDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  status: z.enum(["DRAFT", "PENDING", "PAID", "CANCELLED", "Draft", "Pending", "Paid", "Cancelled", "Lunas", "DP", "Dibatalkan"]), // Comprehensive list of allowed statuses
  paymentMethod: z.string().optional(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  dpAmount: z.number().nonnegative().optional().default(0),
  dpDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  remainingAmount: z.number().nonnegative().optional().default(0),
  paidFull: z.boolean().optional().default(false),
  paidRemainingDate: z.date().or(z.string().pipe(z.coerce.date())).optional(),
  paidRemainingAmount: z.number().nonnegative().optional().default(0),
  grandTotal: z.number().nonnegative("Total tidak boleh negatif"),
  items: z.array(z.any()).min(1, "Minimal harus ada 1 item"),
});
