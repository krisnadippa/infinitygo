import { z } from "zod";

export const MiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama layanan MICE wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  capacity: z.number().positive("Kapasitas harus lebih dari 0"),
  price: z.number().nonnegative("Harga tidak boleh negatif"),
  discount: z.number().nonnegative("Diskon tidak boleh negatif").optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  imageUrl: z.string().url("Format URL gambar tidak valid").or(z.string().min(1)).optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
