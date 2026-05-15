import { z } from "zod";

export const ExpenseSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID wajib"),
  name: z.string().min(1, "Nama pengeluaran wajib"),
  category: z.enum([
    "TOUR_COST", 
    "VEHICLE_COST", 
    "ACCOMMODATION_COST", 
    "DRIVER_FEE", 
    "OPERATIONAL", 
    "OTHER",
    "Tour",
    "Transport",
    "Hotel",
    "Driver",
    "Operasional",
    "Lainnya"
  ]),
  amount: z.number().positive("Jumlah harus angka positif"),
  date: z.date().or(z.string().pipe(z.coerce.date())),
});
