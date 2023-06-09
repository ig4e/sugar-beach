import { z } from "zod";

export const nameValidation = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const descriptionValidation = z.object({
  en: z.string().optional(),
  ar: z.string().optional(),
});
