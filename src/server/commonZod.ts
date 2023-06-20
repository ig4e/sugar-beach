import { z } from "zod";

/*
    url       String
    key       String
    name      String
    size      Int
    isVideo   Boolean  @default(false)
    createdAt DateTime @default(now())

*/

export const mediaSchema = z.object({
  url: z.string(),
  key: z.string(),
  name: z.string(),
  size: z.number(),
  isVideo: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
