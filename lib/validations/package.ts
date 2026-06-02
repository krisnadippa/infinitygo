import { z } from "zod";

export const TourPackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama paket wajib diisi"),
  location: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().nonnegative("Harga tidak boleh negatif"),
  discount: z.number().nonnegative("Diskon tidak boleh negatif").optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  imageUrl: z.string().url("Format URL gambar tidak valid").or(z.string().min(1)).optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
