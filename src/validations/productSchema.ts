import { z } from "zod";
import { nameValidation } from "./common";

export const productSchema = z.object({
  name: nameValidation,
  description: nameValidation,
  media: z.string().min(1).array().min(1),
  status: z.enum(["ACTIVE", "DRAFT"]),
  price: z.number().positive(),
  compareAtPrice: z.number().positive(),
  quantity: z.number().positive(),
  type: z.string().min(1),
  categories: z.string().uuid().array(),
});
