import { z } from "zod";

export const zodName = z.object({
  ar: z.string().min(1),
  en: z.string().min(1),
});
