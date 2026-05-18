import { z } from "zod";

// Helper schemas for dates that might be empty strings from HTML forms
const dateSchema = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.coerce.date());

const optionalDateSchema = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.coerce.date().optional());

export const InvoiceItemSchema = z.object({
  name: z.string().min(1, "Nama item wajib diisi"),
  type: z.string().min(1, "Tipe item wajib diisi"),
  quantity: z.number().gt(0, "Jumlah item harus lebih dari 0"),
  price: z.number().nonnegative("Harga tidak boleh negatif"),
  subtotal: z.number(),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Nomor invoice wajib"),
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email("Email tidak valid").or(z.literal("")).optional(),
  invoiceDate: dateSchema,
  dueDate: optionalDateSchema,
  status: z.enum(["DRAFT", "PENDING", "PAID", "CANCELLED", "Draft", "Pending", "Paid", "Cancelled", "Lunas", "DP", "Dibatalkan"]), // Comprehensive list of allowed statuses
  paymentMethod: z.string().optional(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  dpAmount: z.number().nonnegative().optional().default(0),
  dpDate: optionalDateSchema,
  remainingAmount: z.number().nonnegative().optional().default(0),
  paidFull: z.boolean().optional().default(false),
  paidRemainingDate: optionalDateSchema,
  paidRemainingAmount: z.number().nonnegative().optional().default(0),
  grandTotal: z.number().nonnegative("Total tidak boleh negatif"),
  items: z.array(InvoiceItemSchema).min(1, "Minimal harus ada 1 item"),
});

