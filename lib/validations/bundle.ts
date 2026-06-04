import { z } from "zod";

export const BundleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama Bundle wajib diisi"),
  description: z.string().optional(),
  imageUrl: z.string().url("Format URL gambar tidak valid").or(z.string().min(1)).optional(),
  originalPrice: z.number().nonnegative("Harga asli tidak boleh negatif"),
  discount: z.number().nonnegative("Diskon tidak boleh negatif").max(100, "Diskon maksimal 100%"),
  discountedPrice: z.number().nonnegative("Harga diskon tidak boleh negatif"),
  locations: z.array(z.string()).min(1, "Pilih minimal satu lokasi"),
  includedItems: z.array(z.string()).min(1, "Pilih minimal satu item yang dibundling"),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
