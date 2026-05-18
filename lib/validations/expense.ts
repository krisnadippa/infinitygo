import { z } from "zod";

const dateSchema = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.coerce.date({ invalid_type_error: "Tanggal pengeluaran wajib diisi", required_error: "Tanggal pengeluaran wajib diisi" }));

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
    "Lainnya",
    "Tour Cost",
    "Vehicle Cost",
    "Accommodation Cost",
    "Driver Fee",
    "Operational",
    "Other"
  ]),
  amount: z.number().positive("Jumlah harus angka positif"),
  date: dateSchema,
});

