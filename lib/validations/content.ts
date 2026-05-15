import { z } from "zod";

export const ContentSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  category: z.string().optional(),
});
