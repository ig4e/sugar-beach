import { z } from "zod";

export const nameValidation = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});
