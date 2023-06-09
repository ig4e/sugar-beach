import { z } from "zod";

export const discountSchema = z.object({
  code: z.string().min(1),
  amount: z.number(),
  expiresAt: z.date().transform((str) => new Date(str)),
});
