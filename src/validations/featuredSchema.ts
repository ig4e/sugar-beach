import { z } from "zod";
import { mediaSchema } from "~/server/commonZod";

export const featuredSchema = z.object({
  productId: z.string().uuid(),
  media: mediaSchema.array().min(1),
});
