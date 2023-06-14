import { z } from "zod";
import { descriptionValidation, nameValidation } from "./common";

export const productSchema = z.object({
  name: nameValidation,
  description: descriptionValidation,
  media: z
    .object({
      key: z.string().min(1),
      url: z.string().min(1),
      isVideo: z.boolean(),
    })
    .array()
    .min(1),
  status: z.enum(["ACTIVE", "DRAFT"]),
  price: z.number().positive(),
  compareAtPrice: z.number().positive(),
  quantity: z.number().positive(),
  type: z.string().min(1),
  categories: z.string().uuid().array(),
});
