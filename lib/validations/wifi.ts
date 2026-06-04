import { z } from "zod";

export const WifiSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama Wifi wajib diisi"),
  type: z.string().min(1, "Tipe wajib diisi"),
  locations: z.array(z.string()).min(1, "Pilih minimal satu lokasi"),
  price: z.number().nonnegative("Harga tidak boleh negatif"),
  discount: z.number().nonnegative("Diskon tidak boleh negatif").optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  imageUrl: z.string().url("Format URL gambar tidak valid").or(z.string().min(1)).optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
