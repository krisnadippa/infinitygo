import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama kendaraan wajib diisi"),
  vehicleType: z.string().min(1, "Tipe kendaraan wajib diisi"),
  brand: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().int().positive("Kapasitas harus positif").optional(),
  pricePerDay: z.number().nonnegative("Harga tidak boleh negatif"),
  discount: z.number().nonnegative("Diskon tidak boleh negatif").optional(),
  driverIncluded: z.boolean().default(false),
  description: z.string().optional(),
  imageUrl: z.string().url("Format URL tidak valid").or(z.string().min(1)).optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
