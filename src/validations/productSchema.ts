import { z } from "zod";
import { descriptionValidation, nameValidation } from "./common";
import { mediaSchema } from "~/server/commonZod";

export const productSchema = z.object({
  name: nameValidation,
  description: descriptionValidation,
  media: mediaSchema.array().min(1),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  price: z.number().positive(),
  compareAtPrice: z.number().positive(),
  quantity: z.number().positive(),
  type: z.string().min(1),
  categories: z.string().uuid().array(),
});
