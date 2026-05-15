import { z } from "zod";

export const AccommodationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama akomodasi wajib diisi"),
  type: z.string().min(1, "Tipe akomodasi wajib diisi"),
  location: z.string().optional(),
  pricePerNight: z.number().nonnegative("Harga tidak boleh negatif"),
  facilities: z.array(z.string()).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Format URL tidak valid").or(z.string().min(1)).optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
