import { z } from "zod";
import { mediaSchema } from "~/server/commonZod";
import { descriptionValidation, nameValidation } from "./common";

export const productSchema = z.object({
  name: nameValidation,
  description: descriptionValidation,
  media: mediaSchema.array().min(1),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  price: z.number().positive(),
  compareAtPrice: z.number().optional(),
  quantity: z.number().min(0),
  type: z.string().min(1),
  categories: z.string().uuid().array(),
});
